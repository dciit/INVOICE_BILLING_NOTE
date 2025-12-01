import { Menu, type MenuProps } from "antd";
import { LogoutOutlined, UserAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const withMenuIcon = (Icon: React.ElementType) => {
    return <span className="text-sm font-bold text-white"><Icon /></span>
};

const menuItems: MenuItem[] = [
    {
        key: 'Register',
        label: 'Register',
        icon: withMenuIcon(UserAddOutlined),
    },
    {
        key: 'Change Password',
        label: 'Change Password',
        icon: withMenuIcon(UserSwitchOutlined),
    },
    {
        key: 'Log Out',
        label: 'Log Out',
        icon: withMenuIcon(LogoutOutlined),
    }
];

interface ManageMenuProps {
    handleLogout: () => void;
    onCloseDrawer: () => void;
}

const ManageMenu = ({ handleLogout, onCloseDrawer }: ManageMenuProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'Log Out') {
            handleLogout();
        }
        else if (e.key === 'Change Password') {
            navigate('/change-password');
        }
        else if (e.key === 'Register') {
            navigate("/register");
        }

        onCloseDrawer(); // ← ปิด Drawer ทุกครั้งที่เลือกเมนู
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
