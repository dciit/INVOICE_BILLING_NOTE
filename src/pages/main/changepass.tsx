import { LockOutlined, UserAddOutlined } from "@ant-design/icons"
import { Input } from "antd"
import type { ReduxInterface } from "../../interface/main.interface";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { Editpass } from "../../interface/mParam";
import Swal from "sweetalert2";
import { API_CHANGEPASS } from "../../service/authen";
import { useNavigate } from "react-router-dom";

function ChangePass() {

    const redux: ReduxInterface = useSelector((state: any) => state.reducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formpass, setFormPass] = useState<Editpass>({
        username: '',
        newPassword: '',
        oldPassword: ''
    });
    const [newpass, setNewpass] = useState<string>('');
    const [confirmpass, setCfpass] = useState<string>('');
    const [alertpass, setAlertPass] = useState<boolean>(true);

    useEffect(() => {
        setFormPass(prev => ({
            ...prev,
            newPassword: newpass,
        }))
    }, [newpass])

    useEffect(() => {
        if (confirmpass !== newpass) {
            setAlertPass(true);
        } else {
            setAlertPass(false)
        }
    }, [confirmpass]);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    const handleChangepass = async () => {
        if (!formpass.oldPassword || !formpass.newPassword) {
            Swal.fire({
                icon: "error",
                title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
                text: "กรุณากรอกข้อมูลให้ครบถ้วน"
            });
            return;
        }

        if (!redux?.authen?.username) {
            Swal.fire({
                icon: "error",
                title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
                text: "ไม่พบ username"
            });
            return;
        }
        console.log(formpass);
        const changepw = await API_CHANGEPASS({
            username: redux.authen.username,
            newPassword: formpass.newPassword,
            oldPassword: formpass.oldPassword
        });

        if (changepw.result == -1) {
            Swal.fire({
                icon: 'error',
                title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
                text: changepw.message
            })
        } else if (changepw.result == -2) {
            Swal.fire({
                icon: 'error',
                title: 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
                text: changepw.message
            })
        } else {
            Swal.fire({
                icon: 'success',
                title: 'เปลี่ยนรหัสผ่านสำเร็จ',
            }).then(() => {
                // setFormPass({
                //     username: '',
                //     newPassword: '',
                //     oldPassword: ''
                // })
                // setNewpass('');
                // setCfpass('');
                handleLogout();
            })
        }
    }

    return (
        <div>
            <div className="text-gray-700 font-semibold text-lg">
                <UserAddOutlined /> CHANGE PASSWORD
                <hr className="my-2" />
                <div className="flex flex-row gap-5">
                    <div className="border border-gray-400 rounded-lg w-[600px] p-3">
                        <form action="changepass" className="max-w-full">
                            {/* new pass */}
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="newpass"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[17rem]"
                                    >
                                        <LockOutlined /> NEW PASSWORD
                                    </label>
                                    <Input
                                        type="password"
                                        id="newpass"
                                        placeholder="*******"
                                        className="w-full text-sm p-2"
                                        value={newpass}
                                        onChange={(e) => setNewpass(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* confirm pass */}
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="confrimpass"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[17rem]"
                                    >
                                        <LockOutlined /> CONFIRM PASSWORD
                                    </label>
                                    <Input
                                        type="password"
                                        id="confirmpass"
                                        placeholder="*******"
                                        className="w-full text-sm p-2"
                                        value={confirmpass}
                                        onChange={(e) => setCfpass(e.target.value)}
                                    />
                                </div>
                            </div>
                            {alertpass && (
                                <span className="text-red-700 font-semibold text-sm">กรูณากรอกpassword ให้ตรงกัน</span>
                            )}
                            <div className="mt-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <label
                                        htmlFor="oldpass"
                                        className="text-sm p-2 border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[17rem]"
                                    >
                                        <LockOutlined /> OLD PASSWORD
                                    </label>
                                    <Input
                                        type="password"
                                        id="oldpass"
                                        placeholder="*******"
                                        className="w-full text-sm p-2"
                                        value={formpass.oldPassword}
                                        onChange={(e) => setFormPass({ ...formpass, oldPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </form>
                        <div id="action" className="flex items-center justify-center pt-3 w-full">
                            <button
                                className='bg-[#f7ad7d] hover:bg-[#ffd8be] focus:ring-3 focus:outline-none focus:ring-[#608BC1] font-bold rounded-lg border-black text-black text-lg md:text-xl w-full sm:w-auto px-6 py-5 md:px-44 md:py-2 text-center'
                                onClick={handleChangepass}
                            >
                                CHANGE PASSWORD
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePass