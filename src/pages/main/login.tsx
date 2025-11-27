import { motion } from "framer-motion";
import { AuroraBackground } from "../../components/ui/aurora-background";
import { ColourfulText } from "../../components/ui/colourful-text";
import { Button, Input } from "antd";
import { base } from "../../constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import type { Login, LoginInterface } from "../../interface/clientreq.interface";
import Swal from "sweetalert2";
import { API_GETTOKEN, API_LOGIN } from "../../service/authen";
import type { ResLogin } from "../../interface/response.interface";
import type { KeyboardEvent } from 'react';
import {
    LockOutlined,
    UserOutlined
} from '@ant-design/icons';

function LoginPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const redxAcc: AuthenInfo = useSelector((state: any) => state.authen);
    const auth = useSelector((state: any) => state.reducer.authen);
    const redxAccRef = useRef(auth);

    useEffect(() => {
        redxAccRef.current = auth;
    }, [auth]);

    useEffect(() => {
        if (auth.login === true) {
            navigate(`${base}/`);
        }
    }, [auth.login]);

    const [loginData, setLoginData] = useState<Login>({
        username: '',
        password: ''
    });

    const [login, setLogin] = useState<LoginInterface>({
        login: false,
        load: false,
        message: '',
    })

    async function handlelogin() {
        if (!loginData.username || !loginData.password) {
            Swal.fire({
                icon: 'warning',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วนก่อนทำการเข้าสู่ระบบ.',
                showConfirmButton: true
            })
            return;
        }

        try {
            setLogin({ login: false, load: true, message: '' });

            const gettoken = await API_GETTOKEN({
                username: loginData.username,
                password: loginData.password
            });
            console.log(gettoken)

            if (!gettoken || gettoken.status) {
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: 'ไม่สามารถรับ token จากระบบได้',
                });
                return;
            } else if (gettoken.status == -2) {
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: gettoken.message
                })
            } else if (gettoken.status == -3) {
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: gettoken.message
                })
            }

            console.log('ก่อนเรียก API_LOGIN', loginData);
            const reslogin: ResLogin = await API_LOGIN({
                username: loginData.username,
                password: loginData.password,
                token: gettoken.result
            });

            if (reslogin.result === 'OK') {
                setLogin({ login: true, load: false, message: 'success' });
                const token = gettoken.result;
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        input: reslogin.input,
                        pwd: reslogin.pwd,
                        token,
                        username: loginData.username,
                        login: true
                    }
                });
                localStorage.setItem('token', token);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถเข้าสู่ระบบได้',
                    text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้งเนื่องจากไม่มี token'
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับระบบได้ในขณะนี้'
            });
        }
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handlelogin();
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
                <div className='container w-full'>

                </div>
                <div className='border border-gray-300 rounded-xl p-4 md:p-28 max-w-full h-auto'>
                    <div className="p-3 text-2xl md:text-4xl font-bold text-black text-center">
                        <ColourfulText text='INVOICE ONLINE' />
                    </div>
                    <form className='max-w-full mt-5'>
                        <div className='mb-6'>
                            <div className='flex flex-col md:flex-row gap-2'>
                                <label
                                    htmlFor="username"
                                    className='text-sm p-2 md:text-xl md:p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
                                >
                                    <UserOutlined />
                                    USERNAME
                                </label>
                                <Input
                                    type='text'
                                    id='username'
                                    placeholder='Enter username'
                                    className="w-full text-sm md:text-lg p-2"
                                    value={loginData.username}
                                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                    autoFocus onKeyDown={handleKeyPress}
                                />
                            </div>
                            <div className='mt-4'>
                                <div className='flex flex-col md:flex-row gap-2'>
                                    <label
                                        htmlFor="password"
                                        className='text-sm p-2 md:text-xl md:p-3 border border-black rounded-md bg-[#FFF5D7] font-semibold text-black flex items-center gap-2'
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
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        autoFocus onKeyDown={handleKeyPress}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="flex justify-center items-center">
                        <a href={`${base}/register`} className="text-red-500 font-bold">ลงทะเบียนใหม่</a>
                    </div>
                    <div id="action" className='flex items-center justify-center pt-3 mt-3 w-full'>
                        <Button
                            className='bg-[#133E87] hover:bg-[#c5e3f5] focus:ring-3 focus:outline-none focus:ring-[#D4EBF8] font-bold rounded-lg border-black text-white text-lg md:text-xl w-full sm:w-auto px-6 py-5 md:px-44 md:py-6 text-center'
                            onClick={handlelogin}
                        >
                            Login
                        </Button>
                    </div>
                    {/* <div className=' text-center'>
                        <span className='text-red-500 text-[14px] w-full'>{login.message}</span>
                    </div>
                    <div className='items-center flex justify-center pt-10'>
                        <div className={
                            `flex flex-row items-center gap-2 text-center  cursor-pointer select-none transition-all duration-300 text-white ${login.load ? 'pl-4 pr-6 bg-[#2196f387] ' :
                                'px-6 bg-[#108de7] hover:bg-[#2196f3]'} py-2 rounded-xl shadow-md w-fit`
                        }
                            onClick={() => {
                                if (!login.load) handlelogin();
                            }}
                        >
                            {
                                login.load && <Spin size='default' />

                            }
                            <span>{login.load ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}</span>
                        </div>
                    </div> */}
                </div>
                {/* <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover={false}
                    theme="light"
                /> */}
            </motion.div>
        </AuroraBackground>
    )
}


export default LoginPage;