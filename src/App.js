// @flow
import type { Node } from "react";
import RotatingCube from "./cube/RotatingCube.js";

import "./App.css";

const App = (): Node => (
    <div className="App">
        <header className="App-header">
            <p>Hello cube!</p>
            <a
                className="App-link"
                href="http://cube.deadalnix.me/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Start cubing!
            </a>
            <RotatingCube size="500px" />
        </header>
    </div>
);

export default App;
