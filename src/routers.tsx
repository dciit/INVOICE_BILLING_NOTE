import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";
import Homepage from "./pages/main/homepage";
import EBilling_Vendor from "./pages/Vendorr/EBilling_InvoiceVendor";
import EBilling_ReportVendor from "./pages/Vendorr/EBilling_ReportVendor";
import EBilling_ReportAC from "./pages/Account/EBilling_ReportAC";
import ChangePass from "./pages/main/changepass";
import CalendarBulling from "./pages/builling/Calendar_Blling";
import Accountsetting from "./pages/main/accountsetting";
import ConfirmSetting from "./pages/main/confirmsetting";
import EBilling_SummaryAC from "./pages/Account/EBilling_SummaryAC";
import EBilling_ConfirmAC from "./pages/Account/EBilling_ConfirmAC";
import EBilling_Payment from "./pages/Account/EBilling_Payment";
import EBilling_DashboardAC from "./pages/Account/EBilling_DashboardAC";
import EBilling_DashboardVD from "./pages/Vendorr/EBilling_DashboardVD";



function Routers() {

    return (
        <Router basename="/E-BILLING">
            <Routes>



                <Route element={<Layout />}>
                    <Route path="*" element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="homepage" element={<Homepage />} />


                    <Route path="DashboardAC" element={<EBilling_DashboardAC />} />
                    <Route path="SummaryAC" element={<EBilling_SummaryAC />} />
                    <Route path="ConfirmAC" element={<EBilling_ConfirmAC />} />
                    <Route path="Payment" element={<EBilling_Payment />} />
                    <Route path="ReportAC" element={<EBilling_ReportAC />} />

                    <Route path="DashboardVendor" element={<EBilling_DashboardVD />} />
                    <Route path="Invoice" element={<EBilling_Vendor />} />
                    <Route path="ReportVendor" element={<EBilling_ReportVendor />} />
                    <Route path="changepass" element={<ChangePass />} />
                    <Route path="calendarbulling" element={<CalendarBulling />} />
                    <Route path="confirmsetting" element={<ConfirmSetting/>} />
                    <Route path="accountsetting" element={<Accountsetting />} />




                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;