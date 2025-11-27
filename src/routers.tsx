import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Login from "./pages/main/login";
import Register from "./pages/main/register";

function Routers() {

    return (
        <Router basename="/invcontrol">
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/*" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Routers;