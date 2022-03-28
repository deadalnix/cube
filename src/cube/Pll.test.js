// @flow
import PllData, { findCanonicalStickers } from "cube/Pll";

import { objectMap } from "cube/CubeUtils";
import parseAlg from "cube/AlgParser";
import printAlg from "cube/AlgPrinter";

test("CanonicalRepresentation", () => {
    const Rotations = (() => {
        let rs = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                rs.push("y" + i + "U" + j);
            }
        }

        return rs;
    })();

    objectMap(PllData, d => {
        const alg = printAlg(d.alg);
        const e = d.stickers;

        for (const r0 of Rotations) {
            const alg0 = r0 + alg;
            for (const r1 of Rotations) {
                const ralg = alg0 + r1;
                expect(findCanonicalStickers(parseAlg(ralg))).toEqual(e);
            }
        }
    });
});

test("Samples", () => {
    expect(PllData.Aa.stickers).toEqual({
        B: "fbrbbbbbb",
        D: "ddddddddd",
        F: "lffffffff",
        L: "blbllllll",
        R: "rrlrrrrrr",
        U: "uuuuuuuuu",
    });

    expect(PllData.Ab.stickers).toEqual({
        B: "bblbbbbbb",
        D: "ddddddddd",
        F: "rfbffffff",
        L: "flfllllll",
        R: "lrrrrrrrr",
        U: "uuuuuuuuu",
    });

    expect(PllData.E.stickers).toEqual({
        B: "rblbbbbbb",
        D: "ddddddddd",
        F: "lfrffffff",
        L: "flbllllll",
        R: "brfrrrrrr",
        U: "uuuuuuuuu",
    });

    expect(PllData.Ga.stickers).toEqual({
        B: "rfbbbbbbb",
        D: "ddddddddd",
        F: "frrffffff",
        L: "lblllllll",
        R: "blfrrrrrr",
        U: "uuuuuuuuu",
    });

    expect(PllData.Gb.stickers).toEqual({
        B: "rlbbbbbbb",
        D: "ddddddddd",
        F: "fbrffffff",
        L: "lrlllllll",
        R: "bffrrrrrr",
        U: "uuuuuuuuu",
    });

    expect(PllData.Na.stickers).toEqual({
        B: "fbbbbbbbb",
        D: "ddddddddd",
        F: "bffffffff",
        L: "lrrllllll",
        R: "rllrrrrrr",
        U: "uuuuuuuuu",
    });

    expect(PllData.Nb.stickers).toEqual({
        B: "bbfbbbbbb",
        D: "ddddddddd",
        F: "ffbffffff",
        L: "rrlllllll",
        R: "llrrrrrrr",
        U: "uuuuuuuuu",
    });
});
