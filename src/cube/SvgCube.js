// @flow
import type { Node } from "react";

import { Point2D, Point3D, midpoint } from "./Point.js";
import { Quaternion } from "./Quaternion.js";

type Face = "R" | "U" | "F" | "L" | "D" | "B";

// Random utility
function objectMap<K, V1, V2>(
    obj: { [K]: V1 },
    fn: (V1, K) => V2
): { [K]: V2 } {
    let result = {};
    for (const [k, v] of Object.entries(obj)) {
        // We need type erasure here, because Object.entries's
        // signature isn't precise enough.
        result[k] = fn((v: any), (k: any));
    }

    return result;
}

// Produce point array for a cube in default position and cache it.
const CubeVerticesCache = new (class {
    cache: { [number]: { [Face]: Array<Point3D> } } = {};

    get(dimention: number): { [Face]: Array<Point3D> } {
        if (dimention in this.cache) {
            return this.cache[dimention];
        }

        const StickersPerFace = dimention * dimention;
        let v = {
            R: Array(StickersPerFace),
            U: Array(StickersPerFace),
            F: Array(StickersPerFace),
            L: Array(StickersPerFace),
            D: Array(StickersPerFace),
            B: Array(StickersPerFace),
        };

        // Fill the face vertices in the default orientation.
        for (let i = 0; i <= dimention; i++) {
            for (let j = 0; j <= dimention; j++) {
                const Index = i * dimention + i + j;
                v.R[Index] = new Point3D(dimention, i, j);
                v.U[Index] = new Point3D(j, 0, dimention - i);
                v.F[Index] = new Point3D(j, i, 0);
                v.L[Index] = new Point3D(0, i, dimention - j);
                v.D[Index] = new Point3D(j, dimention, i);
                v.B[Index] = new Point3D(dimention - j, i, dimention);
            }
        }

        // Recenter the point and scale based on dimention.
        const CenterOffset = -dimention / 2;
        const Scale = 1 / dimention;

        return (this.cache[dimention] = objectMap(v, pf =>
            pf.map(p => p.offset(CenterOffset, Scale))
        ));
    }
})();

type Orientation = Quaternion | {| alpha: number, beta: number |};

type Props = {
    dimention: number,
    orientation: Orientation,
    size: string,
    colorList: { [string]: string },
    stickers?: { [Face]: string },
};

const SvgCube = ({
    dimention,
    orientation,
    size,
    colorList,
    stickers,
}: Props): Node => {
    const StickersPerFace = dimention * dimention;
    const Stickers = stickers || {
        R: "r".repeat(StickersPerFace),
        U: "u".repeat(StickersPerFace),
        F: "f".repeat(StickersPerFace),
        L: "l".repeat(StickersPerFace),
        D: "d".repeat(StickersPerFace),
        B: "b".repeat(StickersPerFace),
    };

    const Q =
        orientation instanceof Quaternion
            ? orientation
            : new Quaternion()
                  .rotateY(orientation.beta)
                  .rotateX(-orientation.alpha);

    const FaceVertices: { [Face]: ?Array<Point2D> } = (() => {
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

        return objectMap(CubeVerticesCache.get(dimention), (pf, f) => {
            if (!FaceVisibilities[f]) {
                return null;
            }

            const Depth = 5;
            return pf.map(p => p.rotate(Q).project(Depth));
        });
    })();

    const Plans = dimention + 1;

    const FaceOutline = ({ face }) => {
        const Vertices = FaceVertices[face];
        if (!Vertices) {
            return null;
        }

        const OutlineScale = 0.94;
        const Points = [
            Vertices[0],
            Vertices[dimention],
            Vertices[dimention * (Plans + 1)],
            Vertices[dimention * Plans],
        ].map(p => p.scale(OutlineScale));

        return <polygon fill="#000000" stroke="#000000" points={Points} />;
    };

    const Facelets = ({ face }) => {
        const Vertices = FaceVertices[face];
        if (!Vertices) {
            return null;
        }

        const StickerColors = Stickers[face];

        let facelets = [];
        for (let i = 0; i < dimention; i++) {
            for (let j = 0; j < dimention; j++) {
                const Index = i * Plans + j;
                const P1 = Vertices[Index];
                const P2 = Vertices[Index + Plans];
                const P3 = Vertices[Index + Plans + 1];
                const P4 = Vertices[Index + 1];

                // Find centre point of facelet
                const FaceletCenter = midpoint(P1, P3);

                // Scale points in towards centre
                const FaceLetScale = 0.85;
                const Points = [P1, P2, P3, P4].map(p =>
                    p.rescale(FaceletCenter, FaceLetScale)
                );

                const ColorIndex = i * dimention + j;
                const Color = colorList[StickerColors.charAt(ColorIndex)];

                // Generate facelet polygon
                facelets.push(
                    <polygon
                        key={ColorIndex}
                        fill={Color}
                        stroke="#000000"
                        points={Points}
                    />
                );
            }
        }

        return facelets;
    };

    const SvgStyle = {
        width: size,
        height: size,
    };

    const Faces: Array<Face> = ["R", "U", "F", "L", "D", "B"];

    return (
        <svg viewBox="-0.9 -0.9 1.8 1.8" style={SvgStyle}>
            <g strokeWidth="0.1" strokeLinejoin="round">
                {Faces.map(f => (
                    <FaceOutline key={f} face={f} />
                ))}
            </g>
            <g strokeWidth="0" strokeLinejoin="round">
                {Faces.map(f => (
                    <Facelets key={f} face={f} />
                ))}
            </g>
        </svg>
    );
};

SvgCube.defaultProps = {
    dimention: 3,
    orientation: {
        alpha: -25,
        beta: 45,
    },
    size: "200px",
    colorList: {
        r: "#8c000f",
        u: "#ffd200",
        f: "#003373",
        l: "#ff4600",
        d: "#f8f8f8",
        b: "#00732f",
        h: "#707070",
        j: "#404040",
        k: "#999999",
        g: "#555555",
        v: "#600d75",
    },
};

export default SvgCube;
