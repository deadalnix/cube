// @flow
import { Location } from "cube/Alg";
import invertAlg from "cube/AlgInverter";
import parseAlg from "cube/AlgParser";
import printAlg from "cube/AlgPrinter";

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
