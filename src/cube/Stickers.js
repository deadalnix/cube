// @flow
import {
    type Direction,
    type Face,
    getDirection,
    objectMap,
} from "./CubeUtils.js";

import type { Location, Alg } from "./Alg.js";
import runAlg from "./AlgRunner.js";

export type Stickers = { [Face]: string };

export const makeDefaultStickers = (dimention: number): Stickers => {
    const StickersPerFace = dimention * dimention;
    return {
        R: "r".repeat(StickersPerFace),
        U: "u".repeat(StickersPerFace),
        F: "f".repeat(StickersPerFace),
        L: "l".repeat(StickersPerFace),
        D: "d".repeat(StickersPerFace),
        B: "b".repeat(StickersPerFace),
    };
};

type AxisFaces = [Face, Face, Face, Face];
type AxisDirections = [Direction, Direction, Direction, Direction];

type AxisDescriptor = {|
    opposite: Face,
    faces: AxisFaces,
    directions: AxisDirections,
|};

const Axis: { [Face]: AxisDescriptor } = {
    R: {
        opposite: "L",
        faces: ["F", "U", "B", "D"],
        directions: [-1, -1, 1, -1],
    },
    U: { opposite: "D", faces: ["R", "F", "L", "B"], directions: [0, 0, 0, 0] },
    F: {
        opposite: "B",
        faces: ["U", "R", "D", "L"],
        directions: [2, 1, 0, -1],
    },
    L: {
        opposite: "R",
        faces: ["D", "B", "U", "F"],
        directions: [1, -1, 1, 1],
    },
    D: { opposite: "U", faces: ["B", "L", "F", "R"], directions: [2, 2, 2, 2] },
    B: {
        opposite: "F",
        faces: ["L", "D", "R", "U"],
        directions: [1, 2, -1, 0],
    },
};

const flipDirection = (direction: Direction): Direction =>
    [1, 0, -1, 2][direction + 1];

const delta = (d0: Direction, d1: Direction): Direction =>
    getDirection(d0 - d1);

export const getStickersForAlg = (
    alg: Alg,
    dimention: number,
    base: ?Stickers
): Stickers => {
    const g = new StickersGenerator(dimention, base);
    runAlg(alg, (location: Location, move: string, count: number) => {
        const direction = getDirection(count);

        switch (move) {
            case "R":
            case "U":
            case "F":
            case "L":
            case "D":
            case "B":
                g.turnFace(move, direction);
                break;

            case "r":
            case "u":
            case "f":
            case "l":
            case "d":
            case "b": {
                const f = { r: "R", u: "U", f: "F", l: "L", d: "D", b: "B" }[
                    move
                ];
                g.turnFace(f, direction);
                g.turnSlice(f, direction, 1);
                break;
            }

            case "x":
            case "y":
            case "z":
                g.turnCube({ x: "R", y: "U", z: "F" }[move], direction);
                break;

            case "M":
            case "E":
            case "S": {
                const f = { M: "L", E: "D", S: "F" }[move];
                for (let i = 1; i < dimention - 1; i++) {
                    g.turnSlice(f, direction, i);
                }
                break;
            }

            default:
                throw new Error("Unsupported move: " + move);
        }
    });

    return g.getStickers();
};

class StickersGenerator {
    +dimention: number;
    stickers: { [Face]: Array<string> };

    constructor(dimention: number, stickers: ?Stickers) {
        this.dimention = dimention;
        stickers = stickers ?? makeDefaultStickers(dimention);

        this.stickers = objectMap(stickers, s => s.split(""));
    }

    getStickers(): Stickers {
        return objectMap(this.stickers, s => s.join(""));
    }

    turnCube(face: Face, direction: Direction): void {
        const axis = Axis[face];

        switch (direction) {
            case 0:
                return;
            case 1:
                this.rotateCube(face);
                break;
            case -1:
                this.rotateCube(axis.opposite);
                break;
            case 2: {
                const faces = axis.faces;
                const directions = axis.directions;

                const swapFaces = (i, j) => {
                    const [fi, fj] = [
                        this.stickers[faces[i]],
                        this.stickers[faces[j]],
                    ];

                    const [di, dj] = [directions[i], directions[j]];

                    this.stickers[faces[i]] = fj;
                    this.stickers[faces[j]] = fi;

                    this.rotateFace(faces[i], delta(dj, di));
                    this.rotateFace(faces[j], delta(di, dj));
                };

                swapFaces(0, 2);
                swapFaces(1, 3);
                break;
            }
        }

        this.rotateFace(face, direction);
        this.rotateFace(axis.opposite, flipDirection(direction));
    }

    rotateCube(face: Face): void {
        const axis = Axis[face];
        const faces = axis.faces;
        const directions = axis.directions;

        let pFace = this.stickers[faces[3]];
        let pDirection = directions[3];

        for (let i = 0; i < 4; i++) {
            const f = faces[i];
            const d = directions[i];
            const next = this.stickers[f];

            this.stickers[f] = pFace;
            this.rotateFace(f, delta(pDirection, d));

            pFace = next;
            pDirection = d;
        }
    }

    turnFace(face: Face, direction: Direction): void {
        this.rotateFace(face, direction);
        this.turnSlice(face, direction, 0);
    }

    rotateFace(face: Face, direction: Direction): void {
        if (direction === 0) {
            return;
        }

        const dimention = this.dimention;
        const f = this.stickers[face];

        let newFace = Array(dimention * dimention);

        for (let i = 0; i < this.dimention; i++) {
            const slice = getSlice(i, direction, f, dimention);
            setSlice(i, 0, newFace, slice);
        }

        this.stickers[face] = newFace;
    }

    turnSlice(face: Face, direction: Direction, n: number): void {
        const axis = Axis[face];
        const faces = axis.faces;
        const directions = axis.directions;

        switch (direction) {
            case 0:
                break;
            case 1:
                this.rotateSlice(n, faces, directions);
                break;
            case -1: {
                const oppositeAxis = Axis[axis.opposite];
                this.rotateSlice(
                    this.dimention - n - 1,
                    oppositeAxis.faces,
                    oppositeAxis.directions
                );
                break;
            }
            case 2:
                const D = this.dimention;
                const _getSlice = i =>
                    getSlice(n, directions[i], this.stickers[faces[i]], D);
                const _setSlice = (i, s) =>
                    setSlice(n, directions[i], this.stickers[faces[i]], s);

                // Swap slices 2 by 2.
                const slice0 = _getSlice(0);
                const slice2 = _getSlice(2);

                _setSlice(0, slice2);
                _setSlice(2, slice0);

                const slice1 = _getSlice(1);
                const slice3 = _getSlice(3);

                _setSlice(1, slice3);
                _setSlice(3, slice1);

                break;
        }
    }

    rotateSlice(n: number, faces: AxisFaces, directions: AxisDirections): void {
        const dimention = this.dimention;

        let slice = getSlice(
            n,
            directions[3],
            this.stickers[faces[3]],
            dimention
        );

        for (let i = 0; i < 4; i++) {
            const d = directions[i];
            const f = faces[i];
            let next = getSlice(n, d, this.stickers[f], dimention);

            setSlice(n, d, this.stickers[f], slice);
            slice = next;
        }
    }
}

const getSlice = (
    n: number,
    direction: Direction,
    face: Array<string>,
    dimention: number
): Array<string> => {
    let slice = Array(dimention);
    switch (direction) {
        case 0:
            for (let i = 0; i < dimention; i++) {
                slice[i] = face[n * dimention + i];
            }

            break;

        case 1:
            for (let i = 0; i < dimention; i++) {
                slice[dimention - i - 1] = face[i * dimention + n];
            }

            break;

        case -1: {
            const base = dimention - n - 1;
            for (let i = 0; i < dimention; i++) {
                slice[i] = face[i * dimention + base];
            }

            break;
        }

        case 2: {
            const base = (dimention - n - 1) * dimention;
            for (let i = 0; i < dimention; i++) {
                slice[dimention - i - 1] = face[base + i];
            }

            break;
        }
    }

    return slice;
};

const setSlice = (
    n: number,
    direction: Direction,
    face: Array<string>,
    slice: Array<string>
): void => {
    const dimention = slice.length;
    switch (direction) {
        case 0:
            for (let i = 0; i < dimention; i++) {
                face[n * dimention + i] = slice[i];
            }

            break;

        case 1:
            for (let i = 0; i < dimention; i++) {
                face[i * dimention + n] = slice[dimention - i - 1];
            }
            break;

        case -1: {
            const base = dimention - n - 1;
            for (let i = 0; i < dimention; i++) {
                face[i * dimention + base] = slice[i];
            }

            break;
        }

        case 2: {
            const base = (dimention - n - 1) * dimention;
            for (let i = 0; i < dimention; i++) {
                face[base + i] = slice[dimention - i - 1];
            }

            break;
        }
    }
};
