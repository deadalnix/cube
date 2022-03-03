// @flow
import type { ParseAction } from "cube/AlgParser";

export type NotationSpec = { [string]: ParseAction | string };

export type Notation = { [string]: NotationEntry, ""?: ParseAction };
export type NotationEntry = Notation | ParseAction;

export const makeNotation = (spec: NotationSpec): Notation =>
    extendNotation({}, spec);

export const extendNotation = (
    notation: Notation,
    spec: NotationSpec
): Notation => {
    const explode = (k: string, e: NotationEntry): [string, NotationEntry] => {
        if (k.length < 2) {
            // Nothing to do.
            return [k, e];
        }

        // We need to explode k char by char.
        for (let i = k.length - 1; i > 0; i--) {
            e = { [k[i]]: e };
        }

        return [k[0], e];
    };

    const merge = (a: ?NotationEntry, b: NotationEntry): NotationEntry => {
        if (typeof a === "undefined") {
            return b;
        }

        if (a === null || typeof a !== "object") {
            if (b === null || typeof b !== "object") {
                return b;
            }

            a = { "": a };
        } else {
            // A is an object, clone it to make sure we don't
            // mess with an existing Notation.
            a = { ...a };
        }

        if (b === null || typeof b !== "object") {
            b = { "": b };
        }

        for (const l in b) {
            a[l] = merge(a[l], b[l]);
        }

        return Object.freeze(a);
    };

    let n = { ...notation };
    for (const k in spec) {
        const [l, e] = explode(k, spec[k]);
        n[l] = merge(n[l], e);
    }

    return Object.freeze(n);
};
