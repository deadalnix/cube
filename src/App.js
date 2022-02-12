// @flow
import type { Node } from "react";
import SvgCube from "./cube/SvgCube.js";

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
            <SvgCube />
        </header>
    </div>
);

export default App;
