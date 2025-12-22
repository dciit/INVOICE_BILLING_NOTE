import { ContactsOutlined, EnvironmentOutlined, InfoOutlined, MailOutlined, PhoneOutlined, PrinterOutlined, UserAddOutlined } from "@ant-design/icons"
import { Input, Select } from "antd"
import { useEffect, useState } from "react"
import type { BankAccount } from "../../interface/response.interface"
import { API_GET_BANKACCOUNT } from "../../service/infobilling.service";

function Accountsetting() {

    const [bankAcc, setBankAcc] = useState<BankAccount[]>([]);


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
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[12rem]'
                                    >
                                        <MailOutlined />
                                        COMPANY NAME
                                    </label>
                                    <Input
                                        type='text'
                                        id='company'
                                        placeholder='Enter Your Company Name'
                                        className="w-full text-sm md:text-sm p-2"
                                    // value={registerData.email}
                                    // onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* email */}
                            < div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="email"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[12rem]'
                                    >
                                        <MailOutlined />
                                        EMAIL
                                    </label>
                                    <Input
                                        type='text'
                                        id='email'
                                        placeholder='Enter Your Email'
                                        className="w-full text-sm md:text-sm p-2"
                                    // value={registerData.email}
                                    // onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* fax */}
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="fax"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[12rem]'
                                    >
                                        <PrinterOutlined />
                                        FAX
                                    </label>
                                    <Input
                                        type='text'
                                        id='fax'
                                        placeholder='Enter Your Fax'
                                        className="w-full text-sm md:text-sm p-2"
                                    // value={registerData.fax}
                                    // onChange={(e) => setRegisterData({ ...registerData, fax: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* tel */}
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="tel"
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[12rem]'
                                    >
                                        <PhoneOutlined />
                                        Telephone
                                    </label>
                                    <Input
                                        type='text'
                                        id='tel'
                                        placeholder='Enter Your Telephone'
                                        className="w-full text-sm md:text-sm p-2"
                                    // value={registerData.tel}
                                    // onChange={(e) => setRegisterData({ ...registerData, tel: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            {/* address */}
                            <div className='my-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor='address'
                                        className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center ga-2 w-[12rem]'
                                    >
                                        <EnvironmentOutlined />
                                        Address
                                    </label>
                                    <Input.TextArea
                                        id='address'
                                        placeholder='Enter Address'
                                        className='w-full text-sm p-2'
                                    // value={registerData.address}
                                    // onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm font-normal"> Company Account</span>
                            <hr className="mb-2" />
                            <div className='mt-4'>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor='account'
                                        className='text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[12rem]'
                                    >
                                        <ContactsOutlined />
                                        Account
                                    </label>
                                    <Select
                                        showSearch={{
                                            filterOption: (input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                                        }}
                                        placeholder="Select a vender"
                                        options={bankOptions}
                                        className='w-full'
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="accountnumber"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[12rem]"
                                    >
                                        <ContactsOutlined />
                                        Account Number
                                    </label>
                                    <Input
                                        type='text'
                                        id='accountnumber'
                                        placeholder='Enter Your Account Number'
                                        className="w-full text-sm p-2"
                                    // value={registerData.tel}
                                    // onChange={(e) => setRegisterData({ ...registerData, tel: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="accountholder"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5DF] font-normal text-black flex items-center gap-2 w-[12rem]"
                                    >
                                        <ContactsOutlined />
                                        Account Holder
                                    </label>
                                    <Input
                                        type="text"
                                        id="accountholder"
                                        placeholder="Enter Your Account Holder"
                                        className="w-full text-sm p-2"
                                    />
                                </div>
                            </div>
                        </>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Accountsetting