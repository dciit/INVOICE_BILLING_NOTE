import { motion } from "framer-motion";
import { AuroraBackground } from "../../components/ui/aurora-background";
import { ColourfulText } from "../../components/ui/colourful-text";
import {
    LockOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Button, Input, Radio, type RadioChangeEvent } from "antd";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { useState } from "react";
import type { RequestRegis } from "../../interface/mParam";
import Swal from "sweetalert2";
import { API_REQUEST_REGISTER } from "../../service/authen";
import { base } from "../../constants";

function Register() {

    const plainOptions: CheckboxGroupProps<string>['options'] = ['ADMIN', 'ACCOUNTANT', 'VENDER'];
    const [role, setRole] = useState('VENDER');
    const [registerData, setRegisterData] = useState<RequestRegis>({
        username: '',
        password: '',
        fname: '',
        lname: '',
        role: ''
    });

    const onChange = ({ target: { value } }: RadioChangeEvent) => {
        // console.log('radio1 checked', value);
        setRole(value);
        setRegisterData(prev => ({ ...prev, role: value }));
    };

    const handleRegisterUser = async () => {

        if (registerData.fname === '' ||
            registerData.lname === '' ||
            registerData.username === '' ||
            registerData.password === '' ||
            registerData.role === '') {
            Swal.fire({
                icon: 'warning',
                title: 'ลงทะเบียนไม่สำเร็จ',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการลงทะเบียน.'
            })
        }

        const regis = await API_REQUEST_REGISTER(registerData);

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
                window.location.href = `${base}/login`;
            })
        }
    }


    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 1,
                    ease: "easeInOut",
                }}
            // className="relative flex gap-4 items-center justify-center px-4"

            >
                <div className="border border-gray-300 rounded-xl p-2 md:p-20 max-w-full h-auto">
                    <div className="text-2xl md:text-4xl font-bold text-black text-center">
                        <ColourfulText text="REGISTER USER ONLINE" />
                    </div>
                    <form className='max-w-full mt-6'>
                        <div className='mb-6'>
                            <div className='flex flex-col md:flex-row gap-2'>
                                <label
                                    htmlFor="firstname"
                                    className='w-52 text-sm p-4 md:text-xl md:p-2 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                                >
                                    <UserOutlined />
                                    FIRSTNAME
                                </label>
                                <Input
                                    type='text'
                                    id='firstname'
                                    placeholder='Enter FirstName'
                                    className="w-full text-sm md:text-lg p-2"
                                    value={registerData.fname.toLocaleUpperCase()}
                                    onChange={(e) => setRegisterData({ ...registerData, fname: e.target.value })}
                                //   autoFocus onKeyDown={handleKeyPress}
                                />
                            </div>
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="lastname"
                                        className='text-sm p-4 md:text-xl md:p-2 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                                    >
                                        <UserOutlined />
                                        LASTNAME
                                    </label>
                                    <Input
                                        // ref={refPass}
                                        type='text'
                                        id='lastname'
                                        placeholder='Enter Lastname'
                                        className="w-full text-sm md:text-lg p-2"
                                        value={registerData.lname.toLocaleUpperCase()}
                                        onChange={(e) => setRegisterData({ ...registerData, lname: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="username"
                                        className='text-sm p-4 md:text-xl md:p-2 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                                    >
                                        <UserOutlined />
                                        USERNAME
                                    </label>
                                    <Input
                                        // ref={refPass}
                                        type='text'
                                        id='username'
                                        placeholder='Enter Username'
                                        className="w-full text-sm md:text-lg p-2"
                                        value={registerData.username}
                                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="password"
                                        className='text-sm p-4 md:text-xl md:p-2 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                                    >
                                        <LockOutlined />
                                        PASSWORD
                                    </label>
                                    <Input
                                        // ref={refPass}
                                        type='password'
                                        id='password'
                                        placeholder='*******'
                                        className="w-full text-sm md:text-lg p-2"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    // autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                            <Radio.Group
                                options={plainOptions}
                                onChange={onChange}
                                value={role}
                                // optionType="button"
                                buttonStyle="solid"
                                className="mt-3 font-semibold text-2xl"
                            />

                        </div>
                    </form>
                    <div id="action" className='flex items-center justify-center pt-3 w-full'>
                        <Button
                            className='bg-[#133E87] hover:bg-[#c5e3f5] focus:ring-3 focus:outline-none focus:ring-[#D4EBF8] font-bold rounded-lg border-black text-white text-lg md:text-xl w-full sm:w-auto px-6 py-5 md:px-44 md:py-6 text-center'
                            onClick={handleRegisterUser}
                        >
                            REGISTER
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AuroraBackground>
    )
}

export default Register;