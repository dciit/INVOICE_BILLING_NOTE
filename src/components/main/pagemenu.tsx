import { Menu, type MenuProps } from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const withMenuIcon = (Icon: React.ElementType) => {
    return <span className="text-sm font-bold text-white"><Icon /></span>
};

const menuItems: MenuItem[] = [
    {
        key: `/invconfrim`,
        label: 'Confirm Invoice',
        icon: withMenuIcon(FileProtectOutlined),
    },
    {
        key: `/invconfrimrp`,
        label: 'Confirm Invoice Report',
        icon: withMenuIcon(FileProtectOutlined),
    }
]

const PageMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleClick: MenuProps['onClick'] = (e) => {
        navigate(e.key)
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

export default PageMenu;