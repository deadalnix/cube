// @flow
import type { Node } from "react";
import RotatingCube from "cube/RotatingCube";

import Plls from "cube/PLL";

const HelloCube = (): Node => (
    <RotatingCube size="500px" stickers={Plls.Na.stickers} />
);
export default HelloCube;
