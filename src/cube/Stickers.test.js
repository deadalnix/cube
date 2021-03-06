// @flow
import parseAlg from "cube/AlgParser";
import {
    type Stickers,
    getStickersForAlg,
    getStickersRotator,
    makeDefaultStickers,
} from "cube/Stickers";

const getStickers = (alg: string): Stickers =>
    getStickersForAlg(parseAlg(alg), 3);

test("getStickersForAlg", () => {
    const TestCases = {
        // All the basic moves.
        "": makeDefaultStickers(3),
        "[F: [R, U]]": {
            R: "uuurrrrrr",
            U: "uuluufubl",
            F: "rufffffff",
            L: "blfllllll",
            D: "ddddddddd",
            B: "brrbbbbbb",
        },
        "[R2: [R'UR, D]]": {
            R: "brfrrrrrr",
            U: "ruuuuuuul",
            F: "ffuffffff",
            L: "ullllllll",
            D: "ddddddddd",
            B: "rbbbbbbbb",
        },
        "[R2: [R'U2R, D]]": {
            R: "lrfrrrrrr",
            U: "uuuuuuruf",
            F: "ufuffffff",
            L: "llbllllll",
            D: "ddddddddd",
            B: "rbbbbbbbb",
        },
        "[R2: [F2, R'B'R]]": {
            R: "brlrrrrrr",
            U: "uuuuuuuuu",
            F: "rfrffffff",
            L: "llfllllll",
            D: "ddddddddd",
            B: "fbbbbbbbb",
        },
        "[R2: [B2, RFR']]": {
            R: "lrfrrrrrr",
            U: "uuuuuuuuu",
            F: "ffbffffff",
            L: "bllllllll",
            D: "ddddddddd",
            B: "rbrbbbbbb",
        },
        "R2F2D2F2U'F2L2UF2L2DLU'BR2BFD'L'F'": {
            R: "dbfurflrf",
            U: "ulufudrfl",
            F: "blbuflbdd",
            L: "bddrlburl",
            D: "ulffddfbd",
            B: "rbruburrl",
        },
        "D'LB2LUR'B'F2UR2D2L2U2F2U'B2R2L2UF'": {
            R: "urlururdd",
            U: "fddfuurlb",
            F: "fdllffubb",
            L: "rrublulfl",
            D: "fluddbflb",
            B: "brdbbrrfd",
        },
        "F2R2UB2D'F2D2R2F2UB'DL'B'R2D2F'U'B'": {
            R: "lfudruudd",
            U: "lufluldbb",
            F: "rldfffbrf",
            L: "bdbuludbu",
            D: "rfrddrlrr",
            B: "lburblfbf",
        },
        "R'B'R2U'R2F'B'RB'R2B2UR2U'L2F2DF2U2L2F2": {
            R: "uldurdruu",
            U: "rlrrudflr",
            F: "dfbbflddu",
            L: "ddlflulfl",
            D: "bffrdrurb",
            B: "bbfbbulbf",
        },
        "R2F'BU2F'R'BUBDR2F2D'F2D'B2D'F2DB2": {
            R: "uffrrlrud",
            U: "lluduulrr",
            F: "dbbbffuld",
            L: "ufbdludlb",
            D: "lfbddrfbf",
            B: "rbfubrldr",
        },
        // Cube rotations.
        "[x'R2: [D2, R'U'R]]": {
            R: "brlrrrrrr",
            U: "uuuuuuuuu",
            F: "rfrffffff",
            L: "llfllllll",
            D: "ddddddddd",
            B: "fbbbbbbbb",
        },
        "[x': [RU'R', D] [RUR', D]]": {
            R: "brfrrrrrr",
            U: "uuuuuuuuu",
            F: "lfrffffff",
            L: "flbllllll",
            D: "ddddddddd",
            B: "rblbbbbbb",
        },
        "[z: U'RDR'URU'RD'R'UR2DR2D']": {
            R: "rflrrrrrr",
            U: "uuuuuuuuu",
            F: "brfffffff",
            L: "llrllllll",
            D: "ddddddddd",
            B: "fbbbbbbbb",
        },
        "R'U2R'U'yR'F'R2U'R'UR'FRU'F": {
            R: "bbbbbbbbb",
            U: "uuuuuuuuu",
            F: "flrrrrrrr",
            L: "rflffffff",
            D: "ddddddddd",
            B: "lrfllllll",
        },
        "[R'U'R, U']x'[R, U']": {
            R: "urrurrrrr",
            U: "bbbbbbbul",
            F: "rrfuubuuu",
            L: "llullfllb",
            D: "llfffffff",
            B: "ddddddddd",
        },
        "[x2: R2L2U2F'L'D2BUD2F2U2L2FR2D2BL2B'D2L2]": {
            R: "rlbfrlrrr",
            U: "dlurubdub",
            F: "bfuufddlu",
            L: "lflulrfbr",
            D: "fufrddldd",
            B: "ldffbbbbu",
        },
        "[y2: UB2LD2RB2D2LU2R2D2U2R'U'F2RB'R2U'L']": {
            R: "flufrfrdl",
            U: "bdfuubbud",
            F: "ubrdfruuu",
            L: "drlblrflr",
            D: "blffdfddb",
            B: "lbrubrdll",
        },
        "[z2: U'D2RFU'B2L'B'F2R2B2U'F2DR2U'B2D'B2U'L]": {
            R: "buudrfrll",
            U: "lrfbufrrr",
            F: "uudlflrlu",
            L: "bubdlfbbf",
            D: "dbfrduldd",
            B: "lfudbrfbd",
        },
        // Various algs with very diverse moves.
        "R'UR'd'R'F'R2U'R'UR'FRF": {
            R: "brfbbbbbb",
            U: "uuuuuuuuu",
            F: "lbrrrrrrr",
            L: "ffbffffff",
            D: "ddddddddd",
            B: "rllllllll",
        },
        "rUR'U'M2'URU'R'U'M'": {
            R: "fufrrrrrr",
            U: "ulufuburu",
            F: "lulffffff",
            L: "bubllllll",
            D: "ddddddddd",
            B: "rurbbbbbb",
        },
        "R2'u'RU'RUR'uR2fR'f'": {
            R: "flrrrrrrr",
            U: "uuuuuuuuu",
            F: "lrlffffff",
            L: "rfbllllll",
            D: "ddddddddd",
            B: "bbfbbbbbb",
        },
        "r'D'FrU'r'F'Dr2Ur'U'r'FrF'": {
            R: "llrrrrrrr",
            U: "uuuuuuuuu",
            F: "ffbffffff",
            L: "rrlllllll",
            D: "ddddddddd",
            B: "bbfbbbbbb",
        },
        "FS'RUR'U'F'US": {
            R: "bbrrrrrrr",
            U: "uruuuulfl",
            F: "uuuffffff",
            L: "rlfllllll",
            D: "ddddddddd",
            B: "bufbbbbbb",
        },
        "f'rUr'U'r'FrS": {
            R: "burrrrrrr",
            U: "uffuubuul",
            F: "fruffffff",
            L: "bllllllll",
            D: "ddddddddd",
            B: "uurbbbbbb",
        },
        "fRf'U'r'U'RUM'": {
            R: "uurrrrrrr",
            U: "fruuuluub",
            F: "rflffffff",
            L: "lbfllllll",
            D: "ddddddddd",
            B: "buubbbbbb",
        },
        "l'R'FRF'RU2r'UrU2'": {
            R: "rrbrrbrrf",
            U: "ffrffffff",
            F: "ddddddddd",
            L: "lllllllll",
            D: "bbbbbbbrr",
            B: "uuuuuuuuu",
        },
    };

    for (const [a, e] of Object.entries(TestCases)) {
        expect(getStickers(a)).toEqual(e);
    }
});

test("getStickersForMove", () => {
    const sr = getStickersRotator(3);

    sr.turnFace("U", 0);
    expect(sr.getStickers()).toEqual({
        R: "rrrrrrrrr",
        U: "uuuuuuuuu",
        F: "fffffffff",
        L: "lllllllll",
        D: "ddddddddd",
        B: "bbbbbbbbb",
    });

    sr.turnFace("U", 1);
    expect(sr.getStickers()).toEqual({
        R: "bbbrrrrrr",
        U: "uuuuuuuuu",
        F: "rrrffffff",
        L: "fffllllll",
        D: "ddddddddd",
        B: "lllbbbbbb",
    });

    sr.turnFace("U", -1);
    expect(sr.getStickers()).toEqual({
        R: "rrrrrrrrr",
        U: "uuuuuuuuu",
        F: "fffffffff",
        L: "lllllllll",
        D: "ddddddddd",
        B: "bbbbbbbbb",
    });

    sr.turnFace("U", 2);
    expect(sr.getStickers()).toEqual({
        R: "lllrrrrrr",
        U: "uuuuuuuuu",
        F: "bbbffffff",
        L: "rrrllllll",
        D: "ddddddddd",
        B: "fffbbbbbb",
    });
});
