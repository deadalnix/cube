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

export type Direction = -1 | 0 | 1 | 2;

export const getDirection = (count: number): Direction => {
    count = ((count - 2) % 4) + 2;
    if (count > 2) {
        count -= 4;
    }

    // Trust me buddy, the math is right.
    return (count: any);
};
