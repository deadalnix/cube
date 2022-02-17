import parseAlg, { CubeNotation } from "./AlgParser.js";
import printAlg from "./AlgPrinter.js";

const parseAndPrint = (alg: string): string =>
    printAlg(parseAlg(alg, CubeNotation));

test("Basic moves", () => {
    // prettier-ignore
    const IdentityCases = [
        "R", "U", "F", "L", "D", "B",
        "R0", "R2", "R3", "R4", "R42",
        "R'", "R2'", "R3'", "R4'", "R42'",
        "R U F L D B",
        "D (R) D", "D (R U F)", "(R U F) D",
        "(R)'", "(R)3", "(R)3'",
        "[R, U]", "[R: U]", "[R U: [R', U]]",
        "[R, U]'", "[R, U]3", "[R, U]3'",
    ];

    for (const alg of IdentityCases) {
        expect(parseAndPrint(alg)).toEqual(alg);
    }

    const TestCases = {
        // Count of 1 gets skipped when printing.
        "R1": "R",
        "R1'": "R'",
        // Whitespace are ignored.
        "RUFLDB": "R U F L D B",
        " R": "R",
        "\nR": "R",
        "\tR": "R",
        "R ": "R",
        "R\n": "R",
        "R\t": "R",
        "  \n\t  R  \n\t  ": "R",
        "(R)": "R",
        "( R)": "R",
        "(R )": "R",
    };

    for (const [a, e] of Object.entries(TestCases)) {
        expect(parseAndPrint(a)).toEqual(e);
    }
});
