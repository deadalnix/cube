// @flow
import type { Node } from "react";
import RotatingCube from "cube/svg/RotatingCube";
import Face from "cube/svg/Face";

import PLL from "cube/Pll";

const HelloCube = (): Node => (
    <>
        <RotatingCube style={{ height: "500px" }} stickers={PLL.Rb.stickers} />
        <Face style={{ height: "500px" }} stickers={PLL.Rb.stickers} />
    </>
);

export default HelloCube;
