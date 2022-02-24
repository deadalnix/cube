// @flow
import type { Node } from "react";
import RotatingCube from "./cube/RotatingCube.js";

import Plls from "./cube/PLL.js";

const HelloCube = (): Node => (
    <>
        <p>Hello cube!</p>
        <RotatingCube size="500px" stickers={Plls.Na.stickers} />
    </>
);

export default HelloCube;
