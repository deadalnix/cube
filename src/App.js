// @flow
import { type Node } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    useLocation,
    useNavigate,
} from "react-router-dom";

import routes from "routes.js";

import Layout from "layout/Layout";

import RotatingCube from "cube/svg/RotatingCube";

const InvalidRoute = (): Node => {
    const navigate = useNavigate();
    const location = useLocation();

    const m = location.pathname.match(/^(.*)\/index\.html$/);
    if (m) {
        return <Navigate to={m[1]} />;
    }

    // Redirect to home after a while.
    setTimeout(() => navigate(""), 5000);

    return (
        <div className="w-100 text-center">
            <h1>Oooops!</h1>
            <RotatingCube size={400} />
            <p>We can't find what you're looking for.</p>
        </div>
    );
};

const App = (): Node => (
    <Router basename={process.env.PUBLIC_URL}>
        <Layout>
            <Routes>
                {routes.map(({ path, Component }, key) => (
                    <Route path={path} element={<Component />} key={key} />
                ))}
                <Route path="*" element={<InvalidRoute />} />
            </Routes>
        </Layout>
    </Router>
);

export default App;
