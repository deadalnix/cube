// @flow
import type { Node } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HelloCube from "HelloCube";

const App = (): Node => (
    <Router basename={process.env.PUBLIC_URL}>
        <Routes>
            <Route exact path="/" element={<HelloCube />} />
            <Route path="*" element={<p>Poin Poin Poooiiiiiin!</p>} />
        </Routes>
    </Router>
);

export default App;
