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

    const menuItems: MenuItem[] = [
        ...(auth?.role === "rol_accountant"
            ? [{
                key: `/DashboardAC`,
                label: 'Home',
                icon: withMenuIcon(DashboardOutlined),
            }]
            : []
        ),
        ...(auth?.role === "rol_accountant"
            ? [{
                key: `/SummaryAC`,
                label: 'Summary Invoice',
                icon: withMenuIcon(AreaChartOutlined),
            }]
            : []
        ),
        ...(auth?.role === "rol_accountant"
            ? [{
                key: `/ConfirmAC`,
                label: 'Confirm Billing',
                icon: withMenuIcon(CheckOutlined),
            }]
            : []
        ),
        ...(auth?.role === "rol_accountant"
            ? [{
                key: `/Payment`,
                label: 'Confirm Payment',
                icon: withMenuIcon(DollarOutlined),
            }]
            : []
        ),
        // ...(auth?.role === "rol_accountant"
        //     ? [{
        //         key: `/ReportAC`,
        //         label: 'Report',
        //         icon: withMenuIcon(LikeOutlined),
        //     }]
        //     : []
        // ),

        /******** VENDOR */
        ...(auth?.role === "rol_vender"
            ? [{
                key: `/DashboardVendor`,
                label: 'Dashboard',
                icon: withMenuIcon(DashboardOutlined),
            }]
            : []
        ),
        ...(auth?.role === "rol_vender"
            ? [{
                key: `/Invoice`,
                label: 'Invoice',
                icon: withMenuIcon(FileProtectOutlined),
            }]
            : []
        ),
        ...(auth?.role === "rol_vender"
            ? [{
                key: `/ReportVendor`,
                label: 'Report',
                icon: withMenuIcon(LikeOutlined),
            }]
            : []
        ),

        {
            key: `/calendarbulling`,
            label: 'Calendar Billing',
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
