import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/main/login";

function Layout() {
    const redux = useSelector((state: any) => state.reducer);
    let login: boolean = typeof redux.login != 'undefined' ? redux.login : false;

    return (
        <>
            {
                login ? <Outlet /> : <Login />
            }
            {/* <Outlet /> */}
        </>
    )
}

export default Layout;