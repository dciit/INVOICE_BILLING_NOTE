import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/main/login";
import Toolbar from "./components/main/toolbar";
import { useEffect } from "react";
import type { AuthenInfo } from "./interface/main.interface";

function Layout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redux: AuthenInfo = useSelector((state: any) => state.reducer);
    let login: boolean = typeof redux.login != 'undefined' ? redux.login : false;


    useEffect(() => {
        if (!redux.login || !redux.token) return;

        try {
            const payload = JSON.parse(atob(redux.token.split('.')[1]));
            const expireAt = payload.exp * 1000;
            const timeout = expireAt - Date.now();

            if (timeout > 0) {
                const timer = setTimeout(() => {
                    dispatch({ type: 'LOGOUT' });
                    localStorage.removeItem('token');
                    navigate(`/login`)
                }, timeout);
                return () => clearTimeout(timer)
            } else {
                dispatch({ type: 'LOGOUT' });
                navigate(`/login`)
            }
        } catch (err) {
            dispatch({ type: 'LOGOUT' });
            navigate(`/login`)
        }
    }, [redux.login, redux.token, dispatch, navigate])

    return (
        <>
            {
                login ?
                    <div className="max-h-screen flex flex-col font-sans">
                        <Toolbar />
                        <div className="flex-1 bg-[#fdfdfd] pt-2 pb-2 px-2 flex flex-col dark:bg-gray-800">
                            <div className="flex-1 bg-white border border-gray-300 dark:bg-gray-800  rounded-md p-3 min-h-0 overflow-hidden">
                                <div className="h-screen">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <Login />
            }
            {/* <Outlet /> */}
        </>
    )
}

export default Layout;