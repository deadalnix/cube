// @flow
import React from "react";
import { hydrate, render } from "react-dom";
import App from "App";
import reportWebVitals from "./reportWebVitals";

const root = document.getElementById("root");
const content = (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

if (root?.hasChildNodes()) {
    hydrate(content, root);
} else {
    render(content, root);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
