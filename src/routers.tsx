import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";
import Homepage from "./pages/main/homepage";
import EBilling_confirm from "./pages/builling/EBilling_confirm";
import EBilling_ReportVendor from "./pages/builling/EBilling_ReportVendor";
import EBilling_ReportAC from "./pages/builling/EBilling_ReportAC";
import ChangePass from "./pages/main/changepass";
import EBilling_confirmForAC from "./pages/builling/EBilling_confirmForAC";
import CalendarBulling from "./pages/builling/Calendar_Blling";
import Accountsetting from "./pages/main/accountsetting";


function Routers() {

    return (
        <Router basename="/E-BILLING">
            <Routes>
                <Route element={<Layout />}>
                    <Route path="*" element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="homepage" element={<Homepage />} />
                    <Route path="Invoice" element={<EBilling_confirm />} />
                    <Route path="Invoices" element={<EBilling_confirmForAC />} />
                    <Route path="ReportVendor" element={<EBilling_ReportVendor />} />
                    <Route path="ReportAC" element={<EBilling_ReportAC />} />
                    <Route path="changepass" element={<ChangePass />} />
                    <Route path="calendarbulling" element={<CalendarBulling />} />
                    <Route path="accountsetting" element={<Accountsetting/>} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;