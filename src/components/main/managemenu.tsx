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
        key: 'Change Passwoed',
        label: 'Change Password',
        icon: withMenuIcon(UserSwitchOutlined),
    },
    {
        key: 'Log Out',
        label: 'Log Out',
        icon: withMenuIcon(LogoutOutlined),
    }
]

interface ManageMenuProps {
    handleLogout: () => void;
}

const ManageMenu = ({ handleLogout }: ManageMenuProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'Log Out') {
            handleLogout();
        } else if (e.key === 'Change Password') {
            navigate('/change-password');
        } else if (e.key === 'Register') {
            navigate("/register")
        }
    };

    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const openKeys: string[] = [];
    for (let i = 1; i < pathParts.length; i++) {
        openKeys.push(`/${pathParts.slice(0, i).join("/")}`);
    }

    return (
        <Menu
            mode="inline"
            items={menuItems}
            onClick={handleClick}
            selectedKeys={[currentPath]}
            defaultOpenKeys={openKeys}
            rootClassName="custom-menu"
            style={{
                border: 'none',
                flex: 1,
                overflow: 'auto',
                backgroundColor: "#ABE0F0",
                color: "#ABE0F0"
            }}
        />
    )
}

export default ManageMenu;