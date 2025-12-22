//@ts-nocheck
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { base, projectName, image } from "../../constants";
import React, { useEffect } from "react";
import { Button, Divider, Drawer, Skeleton } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import PageMenu from "./pagemenu";
import ManageMenu from "./managemenu";

function ToolbarComponent() {
    const auth = useSelector((state: any) => state.reducer.authen);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = React.useState<HTMLElement | null>(null);
    const open = Boolean(openMenu);
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [loadAccountContent, setLoadAccountContent] = React.useState(true);



    async function handleOpenMenu(e: React.MouseEvent<HTMLElement>) {
        setOpenMenu(e.currentTarget);
    }

    async function handleCloseMenu() {
        setOpenMenu(null);
    }

    const handleLogout = () => {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
            dispatch({ type: 'LOGOUT' });
            navigate(`/login`);
        }
    }

    const toggleDrawer = (newOpen: boolean) => {
        setOpenDrawer(newOpen);
    }

    const handleHome = () => {
        navigate(`/${base}/homepage`);
    }

    useEffect(() => {
        if (auth.login === true) {
            navigate(`${base}/`);
            setLoadAccountContent(false)
        }
    }, [auth.login]);

    return (
        <div className="h-[50px] bg-[#ABE0F0] border-d border-gray-300 flex justify-between items-center px-3">
            <div className="flex items-center gap-4">
                <Button
                    type="text"
                    icon={<MenuOutlined style={{ color: 'black', fontSize: 22 }} />}
                    onClick={() => setOpenDrawer(true)}
                />

                <Drawer
                    title={
                        <span className="text-black font-bold">
                            E-BILLING SYSTEM
                        </span>
                    }
                    placement="left"
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    style={{ backgroundColor: '#ABE0F0' }}
                    headerStyle={{ borderBottom: '1px solid #fff' }}
                    bodyStyle={{
                        padding: 0,
                        backgroundColor: '#ABE0F0',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* ส่วนบนของ Drawer ที่ scroll ได้ */}
                    <div className="overflow-auto">
                        <PageMenu onCloseDrawer={() => setOpenDrawer(false)} />
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-white p-2">
                        <Divider className="bg-white" />
                        <ManageMenu
                            handleLogout={handleLogout}
                            onCloseDrawer={() => setOpenDrawer(false)}
                        />
                        <div className="text-center text-gray-700">
                            ©2025 Daikin Compressor Industries Ltd.
                        </div>

                    </div>
                </Drawer>


                <span
                    onClick={handleHome}
                    className="text-black font-bold uppercase cursor-pointer text-lg"
                >
                    {projectName}
                </span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {loadAccountContent ? (
                    <Skeleton.Button active size="small" shape="round" />
                ) : (
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => setOpenMenu(e.currentTarget)}
                    >
                        <span className="text-black text-lg font-bold uppercase mr-3">
                            {auth.login ? (
                                <>
                                    <UserOutlined />{" "}
                                    {auth.role === "rol_accountant"
                                        ? auth.incharge
                                        : auth.username}
                                </>
                            ) : (
                                "######"
                            )}
                        </span>


                        {/* <Avatar size={36} style={{ border: '1px solid #00a0e4' }} /> */}
                    </div>
                )}
            </div>


            {/* <MenuComponent
                open={open}
                openMenu={openMenu}
                closeMenu={() => setOpenMenu(null)} logout={function (): void {
                    throw new Error("Function not implemented.");
                } }                // logout={handleLogout}
            /> */}
        </div >
    )
}

export default ToolbarComponent