import { Menu, type MenuProps } from "antd";
import { LogoutOutlined, SettingOutlined, UserAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type MenuItem = Required<MenuProps>["items"][number];

const withMenuIcon = (Icon: React.ElementType) => {
    return <span className="text-sm font-bold text-white"><Icon /></span>
};


interface ManageMenuProps {
    handleLogout: () => void;
    onCloseDrawer: () => void;
}

const ManageMenu = ({ onCloseDrawer, handleLogout  }: ManageMenuProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useSelector((state: any) => state.reducer.authen);
    const isAdmin = auth?.role === "rol_admin" || auth?.role === "rol_accountant";


    const menuItems: MenuItem[] = [
        ...(isAdmin
            ? [{
                key: '/register',
                label: 'Register',
                icon: withMenuIcon(UserAddOutlined),
            }] : []),
        {
            key: '/accountsetting',
            label: 'Account Setting',
            icon: withMenuIcon(SettingOutlined)
        },
        {
            key: '/changepass',
            label: 'Change Password',
            icon: withMenuIcon(UserSwitchOutlined),
        },
        {
            key: 'logout',
            label: 'Log Out',
            icon: withMenuIcon(LogoutOutlined),
        }
    ];

    const handleClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            handleLogout();
        } else {
            navigate(e.key);
        }
        onCloseDrawer();
    };

    return (
        <Menu
            mode="inline"
            items={menuItems}
            onClick={handleClick}
            selectedKeys={[location.pathname]}
            style={{
                border: "none",
                backgroundColor: "#ABE0F0",
            }}
        />
    );
}

export default ManageMenu;
