import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";
import Homepage from "./pages/main/homepage";
import InvoiceConfirm from "./pages/invoice/invoice_confirm";

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
                    <Route path="invconfrimrp" element={<InvoiceConfirm/>}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;