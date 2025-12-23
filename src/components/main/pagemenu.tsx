import { Menu, type MenuProps } from "antd";
import { CalendarOutlined, DollarOutlined, FileProtectOutlined, FileTextOutlined, FormOutlined, ReadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type MenuItem = Required<MenuProps>["items"][number];


const withMenuIcon = (Icon: React.ElementType) => (
    <span className="text-sm font-bold text-white">
        <Icon />
    </span>
);


interface PageMenuProps {
    onCloseDrawer: () => void;
}

const PageMenu = ({ onCloseDrawer }: PageMenuProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useSelector((state: any) => state.reducer.authen);

    const menuItems: MenuItem[] = [
        ...(auth?.role !== "rol_accountant"
            ? [{
                key: `/Invoice`,
                label: 'Invoice',
                icon: withMenuIcon(FormOutlined),
            }]
            : []
        ),
        ...(auth?.role === "rol_accountant"
            ? [{
                key: `/Invoices`,
                label: 'Invoice Report',
                icon: withMenuIcon(FormOutlined),
            }]
            : []
        ),
        {
            key: `/ReportVendor`,
            label: auth?.role === "rol_accountant" ? 'E-Billing' : 'E-Billing',
            icon: withMenuIcon(FileProtectOutlined),
        },
        ...(auth?.role === "rol_accountant"
            ? [{
                key: `/ReportAC`,
                label: 'Payment',
                icon: withMenuIcon(DollarOutlined),
            }]
            : []
        ),
        {
            key: `/calendarbulling`,
            label: 'Calendar Billing Note',
            icon: withMenuIcon(CalendarOutlined)
        },
        {
            key: '/',
            label: 'Manual',
            icon: withMenuIcon(ReadOutlined)
        }
    ];



    const handleClick: MenuProps['onClick'] = (e) => {
        navigate(e.key);
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
};

export default PageMenu;
