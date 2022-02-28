// @flow
import type { Node } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";

import routes from "routes.js";

import Layout from "layout/Layout";

const App = (): Node => {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Layout>
                <Routes>
                    {routes.map(({ path, Component }, key) => (
                        <Route path={path} element={<Component />} key={key} />
                    ))}
                    <Route path="*" element={<Navigate to="/cube" />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
