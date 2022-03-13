// @flow
import type { Node } from "react";

import { makeDefaultStickers } from "cube/Stickers";
import Quaternion from "cube/Quaternion";
import VerticesCache from "cube/VerticesCache";

import { type SvgProps, DefaultSvgProps } from "cube/svg/Props";
import Outline from "cube/svg/Outline";
import Facelets from "cube/svg/Facelets";

type FaceProps = {
    ...SvgProps,
    ...
};

const Face = ({
    dimention,
    size,
    colorList,
    stickers,
    ...props
}: FaceProps): Node => {
    const Stickers = stickers ?? makeDefaultStickers(dimention);
    const Q = Quaternion.face();

    const Depth = 5;
    const project = vs => vs.map(p => p.rotate(Q).project(Depth));

    const cachedVertices = VerticesCache.get(dimention);
    const Vertices = project(cachedVertices.U);

    const Plans = dimention + 1;

    let sideOutlines = [];
    let sideFacelets = [];

    let tx = 0.8 / Plans;
    let ty = 0;

    for (const f of ["R", "F", "L", "B"]) {
        // Project one row of stickers.
        const v = project(cachedVertices[f].slice(0, 2 * Plans));

        // Tip them on the side.
        for (let i = Plans; i < 2 * Plans; i++) {
            v[i] = v[i].translate(tx, ty);
        }

        sideOutlines.push(
            <Outline
                key={f}
                vertices={[
                    v[0],
                    v[dimention],
                    v[2 * dimention + 1],
                    v[dimention + 1],
                ]}
            />
        );

        sideFacelets.push(
            <Facelets
                key={f}
                dimention={dimention}
                vertices={v}
                colors={Stickers[f]}
                colorList={colorList}
                rowCount={1}
            />
        );

        [tx, ty] = [-ty, tx];
    }

    const SvgStyle = {
        width: size,
        height: size,
    };

    return (
        <svg {...props} viewBox="-0.9 -0.9 1.8 1.8" style={SvgStyle}>
            <g strokeWidth="0.1" strokeLinejoin="round">
                <Outline
                    vertices={[
                        Vertices[0],
                        Vertices[dimention],
                        Vertices[dimention * (Plans + 1)],
                        Vertices[dimention * Plans],
                    ]}
                />
                {sideOutlines}
            </g>
            <g strokeWidth="0" strokeLinejoin="round">
                <Facelets
                    dimention={dimention}
                    vertices={Vertices}
                    colors={Stickers.U}
                    colorList={colorList}
                />
                {sideFacelets}
            </g>
        </svg>
    );
};

Face.defaultProps = DefaultSvgProps;

export default Face;
