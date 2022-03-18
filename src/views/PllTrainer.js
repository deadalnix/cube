// @flow
import { type Node, useState } from "react";

import Cube from "cube/svg/Cube";
import { PllPatterns } from "cube/Pll";
import { makeDefaultStickers } from "cube/Stickers";

const computeStickerPatterns = () => {
    const ret = [];
    for (const p in PllPatterns) {
        const stickers = makeDefaultStickers(3);

        ["F", "R", "B", "L"].forEach((f, i) => {
            stickers[f] =
                p.substring(3 * i, 3 * (i + 1)) + stickers[f].substring(3, 9);
        });

        ret.push(
            Object.freeze({
                stickers: stickers,
                pattern: p,
                pll: PllPatterns[p],
            })
        );
    }

    return ret;
};

const StickerPatterns = computeStickerPatterns();

const selectRandomElement = a => a[Math.floor(Math.random() * a.length)];

const PllTrainer = (): Node => {
    const getPosition = () => selectRandomElement(StickerPatterns);
    const [position, setPosition] = useState(getPosition);

    const updatePosition = () => setPosition(getPosition());

    return (
        <Cube
            size="500px"
            stickers={position.stickers}
            onClick={updatePosition}
        />
    );
};

export default PllTrainer;
