import { Menu, type MenuProps } from "antd";
import { AreaChartOutlined, CalendarOutlined, CheckCircleOutlined, CheckOutlined, DashboardOutlined, DollarOutlined, FileProtectOutlined, FileTextOutlined, FormOutlined, LikeOutlined, PieChartOutlined, ReadOutlined } from "@ant-design/icons";
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

    const isAccountant = auth?.role === "rol_accountant";
    const isVendor = auth?.role === "rol_vender";
    const isAdmin = auth?.role === "rol_admin";


    const menuItems: MenuItem[] = [
        /******** ACCOUNTANT ********/
        ...((isAccountant || isAdmin)
            ? [{
                key: `/DashboardAC`,
                label: 'Home',
                icon: withMenuIcon(DashboardOutlined),
            }]
            : []
        ),
        ...((isAccountant || isAdmin)
            ? [{
                key: `/SummaryAC`,
                label: 'Summary Invoice',
                icon: withMenuIcon(AreaChartOutlined),
            }]
            : []
        ),
        ...((isAccountant || isAdmin)
            ? [{
                key: `/ConfirmAC`,
                label: 'Confirm Billing',
                icon: withMenuIcon(CheckOutlined),
            }]
            : []
        ),
        ...((isAccountant || isAdmin)
            ? [{
                key: `/Payment`,
                label: 'Confirm Payment',
                icon: withMenuIcon(DollarOutlined),
            }]
            : []
        ),

        /******** VENDOR ********/
        ...((isVendor || isAdmin)
            ? [{
                key: `/DashboardVendor`,
                label: 'Dashboard',
                icon: withMenuIcon(DashboardOutlined),
            }]
            : []
        ),
        ...((isVendor || isAdmin)
            ? [{
                key: `/Invoice`,
                label: 'Confirm Invoice',
                icon: withMenuIcon(FileProtectOutlined),
            }]
            : []
        ),
        ...((isVendor || isAdmin)
            ? [{
                key: `/ReportVendor`,
                label: 'Report Billing',
                icon: withMenuIcon(LikeOutlined),
            }]
            : []
        ),

        /******** COMMON ********/
        {
            key: `/calendarbulling`,
            label: 'Calendar Billing',
            icon: withMenuIcon(CalendarOutlined),
        },
        {
            key: '/',
            label: 'Manual',
            icon: withMenuIcon(ReadOutlined),
        },
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
