// @flow
import type { Node } from "react";

import { Point3D } from "cube/Point";
import Quaternion, { type Orientation } from "cube/Quaternion";
import { objectMap } from "cube/CubeUtils";
import { makeDefaultStickers } from "cube/Stickers";
import VerticesCache from "cube/VerticesCache";

import Facelets from "cube/svg/Facelets";
import Outline from "cube/svg/Outline";

import {
    DefaultOrientation,
    type SvgProps,
    DefaultSvgProps,
} from "cube/svg/Props";

export type CubeProps = {
    ...SvgProps,
    orientation: Orientation,
    ...
};

const Cube = ({
    dimention,
    orientation,
    size,
    colorList,
    stickers,
    ...props
}: CubeProps): Node => {
    const Stickers = stickers ?? makeDefaultStickers(dimention);
    const Q = Quaternion.fromOrientation(orientation);

    const VISIBILITY_THRESOLD = -0.105;

    // Compute normal vectors for each face and do backface culling.
    const FaceVisibilities = objectMap(
        {
            R: new Point3D(1, 0, 0),
            U: new Point3D(0, -1, 0),
            F: new Point3D(0, 0, -1),
            L: new Point3D(-1, 0, 0),
            D: new Point3D(0, 1, 0),
            B: new Point3D(0, 0, 1),
        },
        (n: Point3D) => n.rotateZ(Q) < VISIBILITY_THRESOLD
    );

    const Plans = dimention + 1;
    const Depth = 5;
    const cachedVertices = VerticesCache.get(dimention);

    let outlines = [];
    let facelets = [];

    for (const f of ["R", "U", "F", "L", "D", "B"]) {
        if (!FaceVisibilities[f]) {
            continue;
        }

        const vertices = cachedVertices[f].map(p => p.rotate(Q).project(Depth));

        outlines.push(
            <Outline
                key={f}
                vertices={[
                    vertices[0],
                    vertices[dimention],
                    vertices[dimention * (Plans + 1)],
                    vertices[dimention * Plans],
                ]}
            />
        );

        facelets.push(
            <Facelets
                key={f}
                dimention={dimention}
                vertices={vertices}
                colors={Stickers[f]}
                colorList={colorList}
            />
        );
    }

    const SvgStyle = {
        width: size,
        height: size,
    };

    return (
        <svg {...props} viewBox="-0.9 -0.9 1.8 1.8" style={SvgStyle}>
            <g strokeWidth="0.1" strokeLinejoin="round">
                {outlines}
            </g>
            <g strokeWidth="0" strokeLinejoin="round">
                {facelets}
            </g>
        </svg>
    );
};

Cube.defaultProps = {
    ...DefaultSvgProps,
    orientation: DefaultOrientation,
};

export default Cube;
