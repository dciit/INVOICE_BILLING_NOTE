import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";
import Homepage from "./pages/main/homepage";
import InvoiceConfirm from "./pages/invoice/invoice_confirm";
import InvoiceConfirmReport from "./pages/invoice/invoice_confirmrp";
import ChangePass from "./pages/main/changepass";
import CalendarBulling from "./pages/invoice/calendar_bulling";

function Routers() {

    return (
        <Router basename="/invbilling">
            <Routes>
                <Route element={<Layout />}>
                    <Route path="*" element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="homepage" element={<Homepage />} />
                    <Route path="invconfrim" element={<InvoiceConfirm/>}/>
                    <Route path="invconfrimrp" element={<InvoiceConfirmReport/>}/>
                    <Route path="changepass" element={<ChangePass/>} />
                    <Route path="calendarbulling" element={<CalendarBulling />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;