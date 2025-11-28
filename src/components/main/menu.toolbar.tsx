import { Dropdown, type MenuProps } from "antd";

interface MenuComponentProps {
    open: boolean;
    closeMenu: () => void;
    logout: () => void;
    openMenu: HTMLElement | null;
}

function MenuComponent(props: MenuComponentProps) {
    const { open, closeMenu, openMenu } = props;

    const items: MenuProps["items"] = [
        {
            key: 'logout',
            label: 'Logout',
            onClick: () => {
                // logout();
                closeMenu();
            }
        }
    ]

    return (
        <Dropdown
            menu={{items}}
            open={open}
            onOpenChange={(visible) => !visible && closeMenu()}
            getPopupContainer={() => openMenu as HTMLElement}
            placement="bottomRight"
        >

        </Dropdown>
    )
}

export default MenuComponent