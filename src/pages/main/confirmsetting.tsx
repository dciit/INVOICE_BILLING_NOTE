import { CheckSquareOutlined } from "@ant-design/icons";
import { Input, Table } from "antd";
import { useEffect, useState } from "react";
import type { Accfromvendor } from "../../interface/response.interface";
import { API_ACCOUNTSETTINGDATA_FROMVENDOR, API_CONFIRMACCOUNTSETTING } from "../../service/infobilling.service";
import Swal from "sweetalert2";

function ConfirmSetting() {

    const [dataAcc, setDataAcc] = useState<Accfromvendor[]>([]);

    useEffect(() => {
        const fetchAccfromvd = async () => {
            const res = await API_ACCOUNTSETTINGDATA_FROMVENDOR();

            if (res.length > 0) {
                setDataAcc(res)
            } else {
                setDataAcc([]);
            }
        }

        fetchAccfromvd();
    }, [])

    const handleConfirm = async (username: string) => {
        const res = await API_CONFIRMACCOUNTSETTING({
            username: username
        })

        if (res.result === 1) {
            Swal.fire({
                title: 'Do you want to confirm this information?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Confirm",
                denyButtonText: `Don't Confirm`
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Confirmed", "", "success")
                    setDataAcc([]);
                } else if (result.isDenied) {
                    Swal.fire("Information are not confirm", "", "info");
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: 'Confirmation failed!',
                text: 'It have something wrong. try again!'
            })
        }
    }

    const columns = [
        {
            title: <div className="text-sm text-black font-bold text-center">VENDOR CODE</div>,
            key: 'username',
            dataIndex: 'username',
            align: 'center' as 'center',
            // width: 120,
        },
        {
            title: <div className="text-sm text-black font-bold text-center">COMPANY NAME</div>,
            key: 'companyname',
            dataIndex: 'companyname',
            align: 'center' as 'center'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">RESPONSIBLE NAME</div>,
            key: 'name',
            dataIndex: 'name',
            align: 'center' as 'center'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">TAX ID</div>,
            key: 'taxid',
            dataIndex: 'taxid',
            align: 'center' as 'center'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">BRANCH NO</div>,
            key: 'branchno',
            dataIndex: 'branchno',
            align: 'center' as 'center'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">EMAIL</div>,
            key: 'email',
            dataIndex: 'email',
            align: 'left' as 'left'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">TEL</div>,
            key: 'telephone',
            dataIndex: 'telephone',
            align: 'right' as 'right'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">FAX</div>,
            key: 'fax',
            dataIndex: 'fax',
            align: 'right' as 'right'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">ADDRESS</div>,
            key: 'address',
            dataIndex: 'address',
            align: 'left' as 'left'
        },
        {
            title: <div className="text-sm text-black font-bold text-center">ACCOUUNT</div>,
            key: 'accname',
            dataIndex: 'accname',
            align: 'left' as 'left',
            render: (_text: any, row: Accfromvendor) => (
                <span>{row.accname} <br /> ({row.accno})</span>
            )
        },
        {
            title: <div className="text-sm text-black font-bold text-center">BANK</div>,
            key: 'bankname',
            dataIndex: 'bankname',
            align: 'left' as 'left',
            render: (_text: any, row: Accfromvendor) => (
                <span>{row.bankname} <br /> {row.bankbranchname} <br /> ({row.bankbranchno})</span>
            )
        },
        {
            title: <div className="text-sm text-black font-bold text-center">CONFIRM</div>,
            align: 'center' as 'center',
            render: (_text: any, row: Accfromvendor) => (
                <div className="flex flex-row justify-center items-center gap-2">
                    <button
                        className="p-2 bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700 text-white rounded-lg"
                        onClick={() => handleConfirm(row.username)}
                    >
                        CONFIRM
                    </button>
                    <button className="p-2 bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 text-white rounded-lg">REJECT</button>
                </div>

            )
        }
    ]

    return (
        <div>
            <div className="text-gray-700 font-semibold text-lg">
                <CheckSquareOutlined /> REGISTER USER
                <hr className="my-2" />
                <div className="flex flex-row gap-2 items-center my-4 mx-4">
                    <label htmlFor="searchvd" className="text-black text-sm font-bold">
                        Search Vendor :
                    </label>
                    <Input
                        type="text"
                        id="searchvd"
                        placeholder="Search the vendor you need!"
                        className="p-2 w-[20rem] bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 focus:border-yellow-300 focus:ring-yellow-300 text-sm"
                    />
                </div>
                <hr className="my-2" />
                <Table
                    dataSource={dataAcc}
                    columns={columns}
                    className="p-2"
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            </div>
        </div>
    )
}

export default ConfirmSetting;