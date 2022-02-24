// @flow
import { Location } from "./Alg.js";
import invertAlg from "./AlgInverter.js";
import parseAlg from "./AlgParser.js";
import printAlg from "./AlgPrinter.js";

const parseAndInvert = a => printAlg(invertAlg(parseAlg(a)));

test("Inversions", () => {
    const TestCases = {
        // Count of 1 gets skipped when printing.
        "R": "R'",
        "R2": "R2",
        "R3": "R",
        "R2'": "R2",
        "(R2)'": "R2",
        "(R)2'": "(R)2",
        "((RUF)')'": "(R U F)'",
        "RUFLDB": "B' D' L' F' U' R'",
        "(RUFLDB)'": "R U F L D B",
        "[R: U]": "[R: U']",
        "[R: U]'": "[R: U]",
        "[R: U]2": "[R: U']2",
        "[R: U]2'": "[R: U]2",
        "[RU: [R', U]]": "[R U: [U, R']]",
        "[RU: [R', U]']'": "[R U: [R', U]']",
        "[R: [U, [R: D]]]": "[R: [[R: D], U]]",
    };

    for (const [a, e] of Object.entries(TestCases)) {
        expect(parseAndInvert(a)).toEqual(e);
    }
});
