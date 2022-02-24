// @flow
import type { Node } from "react";

import HelloCube from "./HelloCube.js";
import styles from "./App.scss";

const App = (): Node => (
    <div className={styles.app}>
        <a
            href="http://cube.deadalnix.me/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Start cubing!
        </a>
        <HelloCube />
    </div>
);

export default App;
