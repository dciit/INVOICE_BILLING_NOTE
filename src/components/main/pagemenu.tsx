import { Menu, type MenuProps } from "antd";
import { CalendarOutlined, FileProtectOutlined, FileTextOutlined, FormOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const withMenuIcon = (Icon: React.ElementType) => {
    return <span className="text-sm font-bold text-white"><Icon /></span>
};

const menuItems: MenuItem[] = [
    {
        key: `/invconfrim`,
        label: 'Confirm Invoice',
        icon: withMenuIcon(FormOutlined),
    },
    {
        key: `/invconfrimrp`,
        label: 'Confirm Invoice Report',
        icon: withMenuIcon(FileProtectOutlined),
    },
    {
        key: `/calendarbulling`,
        label: 'Calendar Bulling Note',
        icon: withMenuIcon(CalendarOutlined)
    },
    {
        key: `/manual`,
        label: 'Manual',
        icon: withMenuIcon(FileTextOutlined)
    }
];

interface PageMenuProps {
    onCloseDrawer: () => void;
}

const PageMenu = ({ onCloseDrawer }: PageMenuProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
        onCloseDrawer(); // ← ปิด Drawer
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

export default PageMenu;
