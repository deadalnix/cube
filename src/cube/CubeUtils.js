// @flow
export type Face = "R" | "U" | "F" | "L" | "D" | "B";

// Random utility
export function objectMap<K, V1, V2>(
    obj: { [K]: V1 },
    fn: (V1, K) => V2
): { [K]: V2 } {
    let result = {};
    for (const [k, v] of Object.entries(obj)) {
        // We need type erasure here, because Object.entries's
        // signature isn't precise enough.
        result[k] = fn((v: any), (k: any));
    }

    return result;
}
