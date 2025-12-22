//@ts-nocheck
import {
    LockOutlined,
    UserAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Input, Radio, type RadioChangeEvent } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import type { RequestRegis } from "../../interface/mParam";
import Swal from "sweetalert2";
import { API_REQUEST_REGISTER } from "../../service/authen";

function Register() {

    const plainOptions: CheckboxGroupProps<string>['options'] = ['ADMIN', 'ACCOUNTANT', 'VENDER'];
    const [role, setRole] = useState('VENDER');
    const [registerData, setRegisterData] = useState<RequestRegis>({
        username: '',
        password: '',
        usertype: '',
        incharge: '',
        email: '',
        tel: '',
        textid: '',
        fax: '',
        address: '',
        role: ''
    });

    const onChange = ({ target: { value } }: RadioChangeEvent) => {
        setRole(value);
    };

    useEffect(() => {
        setRegisterData(prev => ({
            ...prev,
            role,
            usertype: role,
            password: role === "VENDER" ? "999999" : ""
        }));
        console.log('selected role:', role)
    }, [role]);

    const handleRegisterUser = async () => {
        if (role == "VENDER") {
            if (registerData.username === '' ||
                registerData.usertype === '' ||
                registerData.role === '') {
                Swal.fire({
                    icon: 'warning',
                    title: 'ลงทะเบียนไม่สำเร็จ',
                    text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการลงทะเบียน.'
                })
            }
        }
        else {
            if (registerData.username === '' ||
                registerData.password === '' ||
                registerData.usertype === '' ||
                registerData.role === '') {
                Swal.fire({
                    icon: 'warning',
                    title: 'ลงทะเบียนไม่สำเร็จ',
                    text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการลงทะเบียน.'
                })
            }
        }

        const regis = await API_REQUEST_REGISTER(registerData);
        console.log(registerData);

        if (regis.status == -1) {
            Swal.fire({
                icon: 'error',
                title: 'ลงทะเบียนไม่สำเร็จ',
                text: regis.message
            })
        } else if (regis.status == -2) {
            Swal.fire({
                icon: 'error',
                title: 'ลงทะเบียนไม่สำเร็จ',
                text: regis.message
            })
        } else {
            Swal.fire({
                icon: 'success',
                title: 'ลงทะเบียนสำเร็จ',
                text: 'ทำการลงทะเบียนเรียบร้อยแล้ว.'
            }).then(() => {
                setRegisterData({
                    username: '',
                    password: '',
                    usertype: '',
                    incharge: '',
                    email: '',
                    tel: '',
                    textid: '',
                    fax: '',
                    address: '',
                    role: ''
                })
            })
        }
    }


    return (
        <div>
            <div className="text-gray-700 font-semibold text-lg">
                <UserAddOutlined /> REGISTER USER
                <hr className="my-2" />
                <div className='flex flex-row gap-5'>
                    <div className="border border-gray-400 rounded-lg w-2/5 p-3">
                        <form className='max-w-full mt-6'>
                            <div className='mb-6'>
                                {/* username */}
                                <div className='mt-4'>
                                    <div className='flex flex-col md:flex-row gap-2'>
                                        <label
                                            htmlFor="username"
                                            className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[10rem]'
                                        >
                                            <UserOutlined />
                                            {role == "VENDER" ? ("TEXX ID") : ("USERNAME")}
                                        </label>
                                        <Input
                                            type='text'
                                            id='username'
                                            placeholder='Enter Username'
                                            className="w-full text-sm md:text-sm p-2"
                                            // maxLength={5}
                                            value={registerData.username.toLocaleUpperCase()}
                                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                        // autoFocus onKeyDown={handleKeyPress}
                                        />
                                    </div>
                                </div>
                                {/* password */}
                                {role != "VENDER" && (
                                    <div className='mt-4'>
                                        <div className='flex flex-col md:flex-row gap-2'>
                                            <label
                                                htmlFor="password"
                                                className='text-sm p-2 md:text-sm border border-black rounded-md bg-[#FFF5D7] font-normal text-black flex items-center gap-2 w-[10rem]'
                                            >
                                                <LockOutlined />
                                                PASSWORD
                                            </label>
                                            <Input
                                                // ref={refPass}
                                                type='password'
                                                id='password'
                                                placeholder='*******'
                                                className="w-full text-sm p-2"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            // autoFocus onKeyDown={handleKeyPress}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <Radio.Group
                                        options={plainOptions}
                                        onChange={onChange}
                                        value={role}
                                        // optionType="button"
                                        buttonStyle="solid"
                                        className="mt-3 font-semibold text-2xl"
                                    />
                                </div>
                                {/* {role === "VENDER" && (
                                <div className='mt-4'>
                                    <Select
                                        showSearch={{
                                            filterOption: (input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                                        }}
                                        placeholder="Select a vender"
                                        options={options}
                                        className='w-full'
                                    />
                                </div>
                            )} */}

                            </div>
                        </form>
                        <div id="action" className='flex items-center justify-center pt-3 w-full'>
                            <button
                                className='bg-[#f7ad7d] hover:bg-[#ffd8be] focus:ring-3 focus:outline-none focus:ring-[#608BC1] font-bold rounded-lg border-black text-black text-lg md:text-xl w-full sm:w-auto px-6 py-5 md:px-44 md:py-2 text-center'
                                onClick={handleRegisterUser}
                            >
                                REGISTER
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >

    )
}

export default Register;