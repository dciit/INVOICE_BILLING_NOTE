import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";
import Homepage from "./pages/main/homepage";

function Routers() {

    return (
        <Router basename="/invbilling">
            <Routes>
                <Route element={<Layout />}>
                    <Route path="*" element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="homepage" element={<Homepage />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;