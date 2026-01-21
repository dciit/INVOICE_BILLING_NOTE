
import { ContactsOutlined, EnvironmentOutlined,  MailOutlined, PhoneOutlined, PrinterOutlined, UserAddOutlined } from "@ant-design/icons"
import { Input, Select } from "antd"
import { useEffect, useState } from "react"
import type { Autheninfo, BankAccount } from "../../interface/response.interface"
import { useSelector } from "react-redux";
import { API_CRDACCOUNTSETTING, API_EDITACCOUNTSETTING, API_GET_BANKACCOUNT, API_GET_INFOAUTHEN } from "../../service/infobilling.service";
import Swal from "sweetalert2";

function Accountsetting() {

    const auth = useSelector((state: any) => state.reducer.authen);
    const [bankAcc, setBankAcc] = useState<BankAccount[]>([]);
    const [account, setAccount] = useState<string>("");
    const [authenInfo, setAuthenInfo] = useState<Autheninfo>({
        username: "",
        usertype: "",
        companY_NAME: "",
        email: "",
        telephone: "",
        taxid: "",
        fax: "",
        compantbranch: "",
        address: "",
        accounT_NAME: "",
        accounT_NUMER: "",
        banK_NAME: "",
        bankbrancH_NAME: "",
        bankbrancH_NO: ""
    });
    const [vdname, setVdname] = useState<string>("");

    useEffect(() => {
        const fetchBankAcc = async () => {
            try {
                const data = await API_GET_BANKACCOUNT();
                setBankAcc(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBankAcc();
    }, []);

    const bankOptions = bankAcc.map(acc => ({
        label: `${acc.account} (${acc.accountname})`,
        value: acc.accountcode
    }));

    const fetchAutheninfo = async () => {
        const res = await API_GET_INFOAUTHEN({ username: auth.username });

        if (res.result === 1) {
            setAuthenInfo(res.data);
            setAccount(res.data.accounT_NUMER);
        } else {
            setAuthenInfo({
                username: "",
                usertype: "",
                companY_NAME: "",
                email: "",
                telephone: "",
                taxid: "",
                fax: "",
                compantbranch: "",
                address: "",
                accounT_NAME: "",
                accounT_NUMER: "",
                banK_NAME: "",
                bankbrancH_NAME: "",
                bankbrancH_NO: ""
            });
        }
    }

    useEffect(() => {
        fetchAutheninfo();
    }, [auth.username]);

    const handleCreateVenderinfo = async () => {

        if (auth.username === "") return;

        const payload = {
            username: auth.username,
                name: vdname,
                compname: authenInfo?.companY_NAME || '',
                email: authenInfo?.email || '',
                taxID: authenInfo?.taxid || '',
                branchno: authenInfo?.compantbranch || '',
                fax: authenInfo?.fax || '',
                telephone: authenInfo?.telephone || '',
                address: authenInfo?.address || '',
                accountname: authenInfo?.accounT_NAME || '',
                accountno: authenInfo?.accounT_NUMER || '',
                bName: authenInfo?.banK_NAME || '',
                bBranchname: authenInfo?.bankbrancH_NAME || '',
                bBranchno: authenInfo?.bankbrancH_NO || ''
        }

        console.log("Payload for API_CREATEACCOUNT:", payload)
        try {
            const res = await API_CRDACCOUNTSETTING(payload);

            if (res.result === 1) {
                Swal.fire({
                    title: 'Do you want to save the information?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('Saved', '', 'success')
                    } else if (result.isDenied) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(error),
            })
        }
    }

    const handleEditVenderinfo = async () => {

        if (auth.username === "") return;

        try {
            const res = await API_EDITACCOUNTSETTING({
                username: auth.username,
                name: vdname,
                compname: authenInfo?.companY_NAME || '',
                email: authenInfo?.email || '',
                taxID: authenInfo?.taxid || '',
                branchno: authenInfo?.compantbranch || '',
                fax: authenInfo?.fax || '',
                telephone: authenInfo?.telephone || '',
                address: authenInfo?.address || '',
                accountname: authenInfo?.accounT_NAME || '',
                accountno: authenInfo?.accounT_NUMER || '',
                bName: authenInfo?.banK_NAME || '',
                bBranchname: authenInfo?.bankbrancH_NAME || '',
                bBranchno: authenInfo?.bankbrancH_NO || ''
            })

            if (res.result === 1) {
                Swal.fire({
                    title: 'Do you want to save the information?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('Saved', '', 'success')
                    } else if (result.isDenied) {
                        Swal.fire('Changes are not saved', '', 'info')
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.message,
                })
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(error),
            })
        }
    }

    return (
        <div>
            <div className="text-gray-700 font-semibold text-lg">
                <UserAddOutlined /> ACCOUNT SETTING
                <hr className="my-2" />
                <div className="border border-gray-400 rounded-lg w-2/5 p-3">
                    <form className="max-w-full">
                        <>
                            <span className="text-gray-400 text-sm font-normal"> Company Infomation</span>
                            <hr className="mb-2" />
                            {/* company */}
                            < div className=''>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="company"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <MailOutlined />
                                        COMPANY NAME
                                    </label>
                                    <Input
                                        type='text'
                                        id='company'
                                        // readOnly
                                        placeholder='Enter Your Company Name'
                                        className="w-full text-sm md:text-sm p-2 text-gray-400"
                                        value={authenInfo?.companY_NAME}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, companY_NAME: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* name */}
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="name"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <UserOutlined />
                                        NAME
                                    </label>
                                    <Input
                                        type='text'
                                        id='name'
                                        // readOnly
                                        placeholder='Enter Your Name'
                                        className="w-full text-sm md:text-sm p-2 text-gray-400"
                                        value={vdname}
                                        onChange={(e) => setVdname(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* email */}
                            < div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="email"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <MailOutlined />
                                        EMAIL
                                    </label>
                                    <Input
                                        type='text'
                                        id='email'
                                        // readOnly
                                        placeholder='Enter Your Email'
                                        className="w-full text-sm md:text-sm p-2 text-gray-400"
                                        value={authenInfo?.email?.trim() ? authenInfo.email : ''}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, email: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* tax id */}
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="taxid"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]"
                                    >
                                        <IdcardOutlined />
                                        TAX ID
                                    </label>
                                    <Input
                                        type='text'
                                        id="taxid"
                                        readOnly
                                        placeholder="Enter Your TaxID"
                                        className="w-full text-sm p-2 text-gray-400"
                                        value={authenInfo?.taxid ?? auth?.username}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, taxid: e.target.value })}
                                    />
                                </div>
                            </div>
                            {/* branch no */}
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="branchno"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]"
                                    >
                                        <IdcardOutlined />
                                        BRANCH NO
                                    </label>
                                    <Input
                                        type='text'
                                        id="branchno"
                                        // readOnly
                                        placeholder="Enter Your Branch No."
                                        className="w-full text-sm p-2 text-gray-400"
                                        value={authenInfo?.compantbranch?.trim() ? authenInfo.compantbranch : ''}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, compantbranch: e.target.value })}
                                    />
                                </div>
                            </div>
                            {/* fax */}
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="fax"
                                        className='text-sm p-2 border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <PrinterOutlined />
                                        FAX
                                    </label>
                                    <Input
                                        type='text'
                                        id='fax'
                                        // readOnly
                                        placeholder='Enter Your Fax'
                                        className="w-full text-sm md:text-sm p-2 text-gray-400"
                                        value={authenInfo?.fax}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, fax: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* tel */}
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="tel"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <PhoneOutlined />
                                        TELEPHONE
                                    </label>
                                    <Input
                                        type='text'
                                        id='tel'
                                        // readOnly
                                        placeholder='Enter Your Telephone'
                                        className="w-full text-sm md:text-sm p-2 text-gray-400"
                                        value={authenInfo?.telephone}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, telephone: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* address */}
                            <div className='my-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor='address'
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <EnvironmentOutlined />
                                        ADDRESS
                                    </label>
                                    <Input.TextArea
                                        id='address'
                                        // readOnly
                                        placeholder='Enter Address'
                                        className='w-full text-sm p-2 text-gray-400'
                                        value={authenInfo?.address}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm font-normal"> Company Bank Detail</span>
                            <hr className="mb-2" />
                            <div className='mt-4'>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor='account'
                                        className='text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]'
                                    >
                                        <ContactsOutlined />
                                        ACCCOUNT NAME
                                    </label>
                                    <Input
                                        type="text"
                                        id="account"
                                        placeholder="Enter Your Account Name"
                                        className="w-full text-sm p-2"
                                        value={authenInfo?.accounT_NAME || ''}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, accounT_NAME: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="accountnumber"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]"
                                    >
                                        <ContactsOutlined />
                                        BANK ACCOUNT NO.
                                    </label>
                                    <Input
                                        type='text'
                                        id='accountnumber'
                                        placeholder='Enter Your Bank Account No.'
                                        className="w-full text-sm p-2"
                                        value={authenInfo?.accounT_NUMER || ''}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, accounT_NUMER: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="bankname"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]"
                                    >
                                        <ContactsOutlined />
                                        BANK NAME
                                    </label>
                                    <Select
                                        showSearch={{
                                            filterOption: (input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                                        }}
                                        value={authenInfo?.banK_NAME || ''}
                                        placeholder="Select a Bank Name"
                                        options={bankOptions}
                                        className='w-full'
                                        onChange={(value) =>
                                            setAuthenInfo((prev) => ({
                                                ...prev!,
                                                banK_NAME: value
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="bankbranchname"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]">
                                        <ContactsOutlined />
                                        BANK BRANCH NAME
                                    </label>
                                    <Input
                                        type="text"
                                        id="bankbranchname"
                                        placeholder="Enter Your Bank Branch Name"
                                        className="w-full text-sm p-2"
                                        value={authenInfo?.bankbrancH_NAME || ''}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, bankbrancH_NAME: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="bankbranchno"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[15rem]"
                                    >
                                        <ContactsOutlined />
                                        BANK BRANCH NO.
                                    </label>
                                    <Input
                                        type="text"
                                        id="bankbranchno"
                                        placeholder="Enter Your Bank Branch No."
                                        className="w-full text-sm p-2"
                                        value={authenInfo?.bankbrancH_NO || ''}
                                        onChange={(e) => setAuthenInfo({ ...authenInfo, bankbrancH_NO: e.target.value })}
                                    />
                                </div>
                            </div>
                            {account ? (
                                <div className="mt-6">
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="button"
                                            className="text-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-4 rounded-lg"
                                            onClick={handleEditVenderinfo}
                                        >
                                            Edit Information
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6">
                                    <div className="flex justify-center items-center">
                                        <button
                                            type="button"
                                            className="text-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded-lg"
                                            onClick={handleCreateVenderinfo}
                                        >
                                            Save Information
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Accountsetting