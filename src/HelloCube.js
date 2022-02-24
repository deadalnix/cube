// @flow
import type { Node } from "react";
import RotatingCube from "./cube/RotatingCube.js";

import Plls from "./cube/PLL.js";

const HelloCube = (): Node => (
    <>
        <p>Hello cube!</p>
        <a
            href="http://cube.deadalnix.me/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Start cubing!
        </a>
        <RotatingCube size="500px" stickers={Plls.Na.stickers} />
    </>
);

export default HelloCube;
