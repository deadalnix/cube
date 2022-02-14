// @flow
import type { Node } from "react";
import type { Point2D, Point3D } from "./Point.js";
import { Quaternion } from "./Quaternion.js";

type Face = "R" | "U" | "F" | "L" | "D" | "B";

// 3D manipulation functions
const offset = ([px, py, pz]: Point3D, o: number, f: number): Point3D => [
    (px + o) * f,
    (py + o) * f,
    (pz + o) * f,
];

const project = ([px, py, pz]: Point3D, d: number): Point2D => {
    let z = pz + d;
    return [(px * d) / z, (py * d) / z];
};

// Scale a point relative to the center of the view.
const scale = ([px, py]: Point2D, f: number): Point2D => [px * f, py * f];

// Scale point relative to origin
const rescale = ([px, py]: Point2D, [ox, oy]: Point2D, f: number): Point2D => [
    (px - ox) * f + ox,
    (py - oy) * f + oy,
];

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

class Rotator {
    CosA: number;
    SinA: number;

    CosB: number;
    SinB: number;

    constructor(alpha: number, beta: number) {
        const Alpha = (Math.PI * alpha) / 180;
        this.CosA = Math.cos(Alpha);
        this.SinA = Math.sin(Alpha);

        const Beta = (Math.PI * beta) / 180;
        this.CosB = Math.cos(Beta);
        this.SinB = Math.sin(Beta);
    }

    rotate(p: Point3D): Point3D {
        const p2 = p[2] * this.CosB - p[0] * this.SinB;
        return [
            p[0] * this.CosB + p[2] * this.SinB,
            p2 * this.SinA + p[1] * this.CosA,
            p2 * this.CosA - p[1] * this.SinA,
        ];
    }

    rotateZ(p: Point3D): number {
        return (
            (p[2] * this.CosB - p[0] * this.SinB) * this.CosA - p[1] * this.SinA
        );
    }
}

// Produce point array for a cube in default position and cache it.
const CubeVerticesCache = new (class {
    cache: { [number]: { [Face]: Array<Array<Point3D>> } };

    constructor() {
        this.cache = {};
    }

    get(dimention: number): { [Face]: Array<Array<Point3D>> } {
        if (dimention in this.cache) {
            return this.cache[dimention];
        }

        const Line = Array(dimention + 1);
        const Face = Line.fill(Line);
        let v = {
            R: Face.map(l => [...l]),
            U: Face.map(l => [...l]),
            F: Face.map(l => [...l]),
            L: Face.map(l => [...l]),
            D: Face.map(l => [...l]),
            B: Face.map(l => [...l]),
        };

        // Fill the face vertices in the default orientation.
        for (let i = 0; i <= dimention; i++) {
            for (let j = 0; j <= dimention; j++) {
                v.R[i][j] = [dimention, j, i];
                v.U[i][j] = [i, 0, dimention - j];
                v.F[i][j] = [i, j, 0];
                v.L[i][j] = [0, j, dimention - i];
                v.D[i][j] = [i, dimention, j];
                v.B[i][j] = [dimention - i, j, dimention];
            }
        }

        // Recenter the point and scale based on dimention.
        const CenterOffset = -dimention / 2;
        const Scale = 1 / dimention;

        return (this.cache[dimention] = objectMap(v, pf =>
            pf.map(pi => pi.map(p => offset(p, CenterOffset, Scale)))
        ));
    }
})();

type Props = {
    dimention: number,
    alpha: number,
    beta: number,
    size: string,
    colorList: { [string]: string },
    stickers?: { [Face]: string },
};

const SvgCube = ({
    dimention,
    alpha,
    beta,
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

    const FaceVertices: { [Face]: ?Array<Array<Point2D>> } = (() => {
        const R = new Rotator(alpha, beta);
        const Q = new Quaternion().rotateY(beta).rotateX(-alpha);

        console.log("New values");

        console.log(R.rotate([1, 0, 0]));
        console.log(Q.rotate([1, 0, 0]));

        console.log(R.rotate([0, 1, 0]));
        console.log(Q.rotate([0, 1, 0]));

        console.log(R.rotate([0, 0, 1]));
        console.log(Q.rotate([0, 0, 1]));

        console.log(R.rotate([1, 1, 0]));
        console.log(Q.rotate([1, 1, 0]));

        console.log(R.rotate([0, 1, 1]));
        console.log(Q.rotate([0, 1, 1]));

        console.log(R.rotate([1, 0, 1]));
        console.log(Q.rotate([1, 0, 1]));

        const VISIBILITY_THRESOLD = -0.105;

        // Compute normal vectors for each face and do backface culling.
        const FaceVisibilities = objectMap(
            {
                R: [1, 0, 0],
                U: [0, -1, 0],
                F: [0, 0, -1],
                L: [-1, 0, 0],
                D: [0, 1, 0],
                B: [0, 0, 1],
            },
            (n: Point3D) => R.rotateZ(n) < VISIBILITY_THRESOLD
        );

        return objectMap(CubeVerticesCache.get(dimention), (pf, f) => {
            if (!FaceVisibilities[f]) {
                return null;
            }

            const Depth = 5;

            return pf.map(pi =>
                pi
                    // Rotate as requested.
                    .map(p => R.rotate(p))
                    // Project the 3D point in 2D
                    .map(p => project(p, Depth))
            );
        });
    })();

    const FaceOutline = ({ face }) => {
        const Vertices = FaceVertices[face];
        if (!Vertices) {
            return null;
        }

        const OutlineScale = 0.94;
        const Points = [
            Vertices[0][0],
            Vertices[dimention][0],
            Vertices[dimention][dimention],
            Vertices[0][dimention],
        ].map(p => scale(p, OutlineScale));

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
                const P1 = Vertices[j][i];
                const P2 = Vertices[j + 1][i];
                const P3 = Vertices[j + 1][i + 1];
                const P4 = Vertices[j][i + 1];

                // Find centre point of facelet
                const FaceletCenter = [
                    (P1[0] + P3[0]) / 2,
                    (P1[1] + P3[1]) / 2,
                ];

                // Scale points in towards centre
                const FaceLetScale = 0.85;
                const Points = [P1, P2, P3, P4].map(p =>
                    rescale(p, FaceletCenter, FaceLetScale)
                );

                const Key = i * dimention + j;
                const Color = colorList[StickerColors.charAt(Key)];

                // Generate facelet polygon
                facelets.push(
                    <polygon
                        key={face + Key}
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
                    <FaceOutline face={f} />
                ))}
            </g>
            <g strokeWidth="0" strokeLinejoin="round">
                {Faces.map(f => (
                    <Facelets face={f} />
                ))}
            </g>
        </svg>
    );
};

SvgCube.defaultProps = {
    dimention: 3,
    alpha: -25,
    beta: 45,
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
