// @flow
import { useState, type Node } from "react";

import { Quaternion } from "./Quaternion.js";
import SvgCube, { type CubeProps } from "./SvgCube.js";

const RotatingCube = (props: CubeProps): Node => {
    const [isRotating, setIsRotating] = useState(false);
    const [Q, setRotation] = useState(
        Quaternion.fromOrientation(props.orientation)
    );

    const rotate = (x, y) => {
        // If we aren't rotating, just do nothing.
        if (!isRotating) {
            return;
        }

        let r = Q;
        if (x !== 0) {
            r = r.rotateY(-x);
        }

        if (y !== 0) {
            r = r.rotateX(y);
        }

        setRotation(r);
    };

    return (
        <SvgCube
            {...props}
            orientation={Q}
            onPointerDown={e => setIsRotating(true)}
            onPointerUp={e => setIsRotating(false)}
            onPointerMove={e => rotate(e.movementX, e.movementY)}
        />
    );
};

RotatingCube.defaultProps = {
    ...SvgCube.defaultProps,
};

export default RotatingCube;
