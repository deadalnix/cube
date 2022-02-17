// @flow
import {
    type Alg,
    Location,
    Move,
    Repeat,
    Sequence,
    Conjugate,
    Commutator,
} from "./Alg.js";

import type { Notation } from "./AlgNotation.js";
import { makeNotation, extendNotation } from "./AlgNotation.js";

export type ParseFunction = (AlgParser, number) => Alg;
export type ParseAction = ParseFunction | string | null;

const parseAlg = (input: string, notation: Notation): Alg => {
    return new AlgParser(input, notation).parse();
};

export default parseAlg;

export class AlgParser {
    +input: string;
    +notation: Notation;

    #index: number = 0;

    get index(): number {
        return this.#index;
    }

    set index(index: number): number {
        if (index < this.#index) {
            throw Error("Try to index backward");
        }

        if (index > this.input.length) {
            throw Error("Try to index past the end of the input");
        }

        return (this.#index = index);
    }

    constructor(input: string, notation: Notation) {
        this.input = input;
        this.notation = notation;
    }

    locationFrom(start: number): Location {
        return new Location(start, this.index);
    }

    parse(): Alg {
        this.#index = 0;

        const alg = this.parseAlg();

        const stop = this.index;
        if (stop < this.input.length) {
            throw Error("Invalid character: " + this.input[stop]);
        }

        return alg;
    }

    parseAlg(): Alg {
        let start = this.index;

        const algs = this.parseSequence();
        if (algs.length === 1) {
            return algs[0];
        }

        return new Sequence(this.locationFrom(start), algs);
    }

    parseSequence(): Array<Alg> {
        let algs = [];
        while (true) {
            this.skipWhitespace();

            const alg = this.parseSubAlg();
            if (!alg) {
                break;
            }

            algs.push(alg);
        }

        this.skipWhitespace();
        return algs;
    }

    skipWhitespace(): void {
        this.parseSubAlg(WhitespaceNotation);
    }

    parseSubAlg(notation: Notation = this.notation): ?Alg {
        const findParseAction = (n: Notation, index: number): ?ParseAction => {
            const input = this.input;
            if (index >= input.length) {
                return;
            }

            const c = input[index];
            if (c in n) {
                let next = n[c];

                if (next === null || typeof next !== "object") {
                    // This is a ParseAction.
                    this.index = index + 1;
                    return next;
                }

                let a = findParseAction(next, index + 1);
                if (a !== null) {
                    return a;
                }
            }

            let next = n[""];
            if (typeof next === "undefined") {
                return;
            }

            this.index = index;
            return next;
        };

        let start = this.index;

        let action = null;
        while (action === null) {
            start = this.index;
            action = findParseAction(notation, start);
        }

        if (typeof action == "undefined") {
            return;
        }

        if (typeof action === "function") {
            return action(this, start);
        }

        // This is a move.
        const count = this.parseCount() ?? 1;
        return new Move(this.locationFrom(start), action, count);
    }

    parseCount(): number | null {
        let index = this.index;
        const input = this.input;
        if (index >= input.length) {
            return null;
        }

        let c = input[index];
        if (c === "'") {
            this.index = index + 1;
            return -1;
        }

        if (c < "0" || c > "9") {
            return null;
        }

        // Ok we have a count!
        let count = 0;

        // Parse count if there is one.
        while (c >= "0" && c <= "9") {
            const ASCII_ZERO = 48;

            count *= 10;
            count += c.charCodeAt(0) - ASCII_ZERO;

            index++;
            if (index >= input.length) {
                break;
            }

            c = input[index];
        }

        if (c === "'") {
            index++;
            count = -count;
        }

        this.index = index;
        return count;
    }
}

export const makeMoveParseFunction =
    (move: string): ParseFunction =>
    (parser: AlgParser, start: number): Alg => {
        const count = parser.parseCount() ?? 1;
        return new Move(parser.locationFrom(start), move, count);
    };

export const makeCountableParseFunction =
    (f: ParseFunction): ParseFunction =>
    (parser: AlgParser, start: number): Alg => {
        const alg = f(parser, start);

        const count = parser.parseCount();
        if (count === null) {
            return alg;
        }

        return new Repeat(parser.locationFrom(start), alg, count);
    };

const WhitespaceNotation = makeNotation({
    " ": null,
    "\n": null,
    "\t": null,
});

export const BaseNotation: Notation = makeNotation({
    "(": makeCountableParseFunction((parser: AlgParser, start: number): Alg => {
        const algs = parser.parseSequence();
        const closingIndex = parser.index;
        if (
            closingIndex >= parser.input.length ||
            parser.input[closingIndex] !== ")"
        ) {
            throw Error("Expected )");
        }

        parser.index = closingIndex + 1;
        return new Sequence(parser.locationFrom(start), algs);
    }),
    "[": makeCountableParseFunction((parser: AlgParser, start: number): Alg => {
        const a = parser.parseAlg();

        const midIndex = parser.index;
        if (midIndex >= parser.input.length) {
            throw Error("Expected conjugate or commutator");
        }

        const type = parser.input[midIndex];
        if (type !== ":" && type !== ",") {
            throw Error("Expected conjugate or commutator");
        }

        parser.index = midIndex + 1;
        const b = parser.parseAlg();

        const closingIndex = parser.index;
        if (
            closingIndex >= parser.input.length ||
            parser.input[closingIndex] !== "]"
        ) {
            throw Error("Expected ]");
        }

        parser.index = closingIndex + 1;
        const location = parser.locationFrom(start);

        return type === ","
            ? new Conjugate(location, a, b)
            : new Commutator(location, a, b);
    }),
});

// prettier-ignore
export const PocketNotation: Notation = extendNotation(BaseNotation, {
    R: 'R', U: 'U', F: 'F', L: 'L', D: 'D', B: 'B',
    r: 'r', u: 'u', f: 'f', l: 'l', d: 'd', b: 'b',
    x: 'x', y: 'y', z: 'z',
});

// prettier-ignore
export const CubeNotation: Notation = extendNotation(PocketNotation, {
    M: "M", m: "m",
    E: "E", e: "e",
    S: "S", s: "s",
});
