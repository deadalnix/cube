// @flow
import { Location } from "./Alg.js";
import runAlg from "./AlgRunner.js";
import parseAlg from "./AlgParser.js";

const expandAlg = (alg: string): string => {
    const formatMove = (move: string, count: number): string => {
        const n = Math.abs(count);

        if (n !== 1) {
            move += n;
        }

        if (count < 0) {
            move += "'";
        }

        return move;
    };

    let pieces = [];

    runAlg(parseAlg(alg), (location: Location, move: string, count: number) => {
        pieces.push(formatMove(move, count));
    });

    return pieces.join(" ");
};

test("Expansion", () => {
    const TestCases = {
        // Count of 1 gets skipped when printing.
        "R": "R",
        "(R)": "R",
        "(R)'": "R'",
        "(R)2'": "R' R'",
        "(R2)'": "R2'",
        "((RUF)')'": "R U F",
        "(RUFLDB)'": "B' D' L' F' U' R'",
        "[R: U]": "R U R'",
        "[R: U]'": "R U' R'",
        "[R: U]2'": "R U' R' R U' R'",
        "[R, U]": "R U R' U'",
        "[R, U]'": "U R U' R'",
        "[R, U]2'": "U R U' R' U R U' R'",
        "[RU: [R', U]]": "R U R' U R U' U' R'",
        "[RU: [R', U]']'": "R U R' U R U' U' R'",
        "[R: [U, [R: D]]]": "R U R D R' U' R D' R' R'",
    };

    for (const [a, e] of Object.entries(TestCases)) {
        expect(expandAlg(a)).toEqual(e);
    }
});
