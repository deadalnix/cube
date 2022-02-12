// @flow
import type { Node } from "react";
import "./App.css";

function App(): Node {
    return (
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
            </header>
        </div>
    );
}

export default App;
