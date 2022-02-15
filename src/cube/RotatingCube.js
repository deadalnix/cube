// @flow
import { useState, type Node } from "react";

import Quaternion, { type Orientation } from "./Quaternion.js";
import SvgCube, { type CubeProps } from "./SvgCube.js";

type RotatingCubeProps = {
    ...?CubeProps,
    orientation?: Orientation,
};

const RotatingCube = ({ orientation, ...props }: RotatingCubeProps): Node => {
    const [isRotating, setIsRotating] = useState(false);

    const [Q, setRotation] = useState(() => {
        const o = orientation ?? SvgCube.defaultProps.orientation;
        return Quaternion.fromOrientation(o);
    });

    const startRotating = e => {
        let target = e.target;
        if (target.tagName !== "svg") {
            target = target.nearestViewportElement;
        }

        target.setPointerCapture(e.pointerId);
        setIsRotating(true);
    };

    const rotate = (x, y) => {
        // If we aren't rotating, just do nothing.
        if (!isRotating) {
            return;
        }

        const RotationSpeed = 0.7;

        let r = Q;
        if (x !== 0) {
            r = r.rotateY(x * -RotationSpeed);
        }

        if (y !== 0) {
            r = r.rotateX(y * RotationSpeed);
        }

        setRotation(r);
    };

    return (
        <SvgCube
            {...props}
            orientation={Q}
            onPointerDown={startRotating}
            onPointerUp={e => setIsRotating(false)}
            onPointerMove={e => rotate(e.movementX, e.movementY)}
        />
    );
};

export default RotatingCube;
