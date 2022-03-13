// @flow
import type { Node } from "react";
import RotatingCube from "cube/svg/RotatingCube";
import Face from "cube/svg/Face";

import Plls from "cube/PLL";

const HelloCube = (): Node => (
    <>
        <RotatingCube size="500px" stickers={Plls.Rb.stickers} />
        <Face size="500px" stickers={Plls.Rb.stickers} />
    </>
);

export default HelloCube;
