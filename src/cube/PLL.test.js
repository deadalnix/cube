// @flow
import PLLs, { findCanonicalStickers } from "cube/PLL";

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

    objectMap(PLLs, d => {
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
