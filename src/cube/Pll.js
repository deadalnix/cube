// @flow
import { objectMap, getDirection, type Direction } from "cube/CubeUtils";

import { type Alg } from "cube/Alg";

import { type Stickers, getStickersRotator } from "cube/Stickers";
import parseAlg from "cube/AlgParser";
import invertAlg from "cube/AlgInverter";

// prettier-ignore
export type PllName =
    "H" | "Ua" | "Ub" | "Z" |
    "Aa" | "Ab" | "E" |
    "T" | "F" | "Ja" | "Jb" | "Ra" | "Rb" |
    "Ga" | "Gb" | "Gc" | "Gd" |
    "Y" | "V" | "Na" | "Nb";

export type PllInfo = {
    name: PllName,
    stickers: Stickers,
    alg: Alg,
};

const DefaulPLLs = {
    H: "M2'UM2'U2M2'UM2'",
    Ua: "M2'UMU2M'UM2'",
    Ub: "M2'U'MU2M'U'M2'",
    Z: "MUM2'UM2'UMU2M2'U'",
    Aa: "r2F2'r'U'rF2'r'Ur'",
    Ab: "r2'B2'rUr'B2'rU'r",
    E: "[x': [RU'R', D][RUR', D]]",
    T: "RUR'U'R'FR2U'R'U'RUR'F'",
    F: "R'U'F'RUR'U'R'FR2U'R'U'RUR'UR",
    Ja: "l'R'FRF'RU2'r'UrU2'x'",
    Jb: "RUR'F'RUR'U'R'FR2U'R'",
    Ra: "RU'R'U'RURDR'U'RD'R'U2R'",
    Rb: "R2'FRURU'R'F'RU2'R'U2R",
    Ga: "R2UR'UR'U'RU'R2U'DR'URD'",
    Gb: "DR'U'RUD'R2UR'URU'RU'R2'",
    Gc: "R2'U'RU'RUR'UR2UD'RU'R'D",
    Gd: "D'RUR'U'DR2U'RU'R'UR'UR2",
    Y: "FRU'R'U'RUR'F'RUR'U'R'FRF'",
    V: "RU'RUR'DRD'RU'DR2'UR2'D'R2",
    Na: "RFU'R'URUF'R2'F'RURU'R'F",
    Nb: "r'D'FrU'r'F'Dr2Ur'U'r'FrF'",
};

const getRotation = (color: string): Direction => {
    switch (color) {
        case "l":
            return 1;

        case "r":
            return -1;

        case "b":
            return 2;

        default:
            return 0;
    }
};

type HeadlightType = Direction | "EPLL" | "Opp";

const getHeadlightType = (s: Stickers): HeadlightType => {
    const left = s.L;
    if (left[0] === left[2]) {
        const front = s.F;
        return front[0] === front[2] ? "EPLL" : 0;
    }

    const front = s.F;
    if (front[0] === front[2]) {
        return 1;
    }

    const back = s.B;
    if (back[0] === back[2]) {
        return -1;
    }

    const right = s.R;
    if (right[0] === right[2]) {
        return 2;
    }

    return "Opp";
};

const findBestAUF = (hlt: HeadlightType, s: Stickers): Direction => {
    if (hlt === "EPLL") {
        const base = getRotation(s.F[4]);
        const u = getRotation(s.F[0]);
        return getDirection(u - base);
    }

    const sr = getStickersRotator(3, s);
    let auf = 0;
    let score = 0;

    // Try to match via AUF.
    for (let i = 0; i < 4; i++) {
        if (i > 0) {
            sr.turnFace("U", 1);
            s = sr.getStickers();
        }

        // This is an CPLL!
        if (
            s.R[1] === s.R[4] &&
            s.F[1] === s.F[4] &&
            s.L[1] === s.L[4] &&
            s.B[1] === s.B[4]
        ) {
            auf = i;
            break;
        }

        // Matching blocks is enough now.
        let blocks = 0;
        for (const face of ["F", "R", "B", "L"]) {
            const f = s[face];
            const e = f[1];
            if (e !== f[4]) {
                // The edge doesn't match.
                continue;
            }

            blocks += (f[0] === e) + (f[2] === e);
        }

        if (blocks > score) {
            score = blocks;
            auf = i;
        }
    }

    return getDirection(auf);
};

const findBestYRot = (
    hlt: HeadlightType,
    s: Stickers,
    auf: Direction
): Direction => {
    if (typeof hlt === "number") {
        return getDirection(hlt - auf);
    }

    let yrot = 0;

    const getScore = (f, e) => {
        const blockLeft = f[0] === f[1];
        const blockRight = f[2] === f[1];

        if (blockLeft) {
            // 3 for a bar, 2 for a block on the left.
            return blockRight ? 4 : 3;
        }

        if (blockRight) {
            // Blocks on the right are not as preferable as on the left.
            return 2;
        }

        // If there are no block, match corner with the edge of the previosu face.
        return f[0] === e ? 1 : 0;
    };

    let sr = getStickersRotator(3, s);
    sr.turnFace("U", auf);
    s = sr.getStickers();

    let score = 0;

    let prevEdge = s.L[1];
    let currentYrot = 0;

    for (const face of ["F", "R", "B", "L"]) {
        const f = s[face];
        const edge = f[1];

        const currentScore = getScore(f, prevEdge);

        // Tie break on the edge matching the center.
        if (currentScore > score || (currentScore === score && edge === f[4])) {
            score = currentScore;
            yrot = currentYrot;
        }

        prevEdge = edge;
        currentYrot++;
    }

    return getDirection(yrot);
};

export const findCanonicalStickers = (alg: Alg): Stickers => {
    const inv = invertAlg(alg);

    let sr = getStickersRotator(3);
    sr.runAlg(inv);

    const findBestFinish = (): [Direction, Direction] => {
        const s = sr.getStickers();
        const hlt = getHeadlightType(s);

        const auf = findBestAUF(hlt, s);
        return [getDirection(auf), findBestYRot(hlt, s, auf)];
    };

    const [auf, yrot] = findBestFinish();

    // Now let's put blue in front.
    sr.turnFace("U", auf);
    sr.turnCube("U", yrot);
    const prerot = getRotation(sr.getStickers().F[4]);

    if (prerot) {
        sr = getStickersRotator(3);
        sr.turnCube("U", prerot);
        sr.runAlg(inv);
        sr.turnFace("U", auf);
        sr.turnCube("U", yrot);
    }

    return sr.getStickers();
};

const loadPLL = (): { [PllName]: PllInfo } =>
    objectMap(DefaulPLLs, (algstr, name) => {
        const alg = parseAlg(algstr);
        const stickers = findCanonicalStickers(alg);

        // TODO: Add a way to override default PLLs using local storage.
        return {
            name: name,
            stickers: stickers,
            alg: alg,
        };
    });

const PLLData: { [PllName]: PllInfo } = loadPLL();
export default PLLData;
