// @flow
import type { Node } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HelloCube from "./HelloCube.js";
import styles from "./App.scss";

const App = (): Node => (
    <div className={styles.app}>
        <Router basename={process.env.PUBLIC_URL}>
            <Routes>
                <Route exact path="/" element={<HelloCube />} />
                <Route path="*" element={<p>Poin Poin Poooiiiiiin!</p>} />
            </Routes>
        </Router>
    </div>
);

export default App;
