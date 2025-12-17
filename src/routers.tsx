import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";
import Homepage from "./pages/main/homepage";
import EBuilling_confirm from "./pages/builling/EBuilling_confirm";
import EBuilling_ReportVendor from "./pages/builling/EBuilling_ReportVendor";
import EBuilling_ReportAC from "./pages/builling/EBuilling_ReportAC";



function Routers() {

    return (
        <Router basename="/invbilling">
            <Routes>
                <Route element={<Layout />}>
                    <Route path="*" element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="homepage" element={<Homepage />} />
                    <Route path="confirm" element={<EBuilling_confirm />} />
                    <Route path="ReportVendor" element={<EBuilling_ReportVendor />} />
                    <Route path="ReportAC" element={<EBuilling_ReportAC />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;