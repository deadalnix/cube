// @flow
import { type Node, useState } from "react";

import Cube from "cube/svg/Cube";
import { DefaultColorList } from "cube/svg/Props";

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

const ColorLists = [DefaultColorList]
    .flatMap(c => [c, Object.assign({}, c, { f: c.b, u: c.d, b: c.f, d: c.u })])
    .flatMap(c => [
        c,
        Object.assign({}, c, { f: c.l, r: c.f, b: c.r, l: c.b }),
        Object.assign({}, c, { f: c.b, r: c.l, b: c.f, l: c.r }),
        Object.assign({}, c, { f: c.r, r: c.b, b: c.l, l: c.f }),
    ]);

const selectRandomElement = <T>(a: Array<T>): T =>
    a[Math.floor(Math.random() * a.length)];

const PllTrainer = (): Node => {
    const getPosition = () => selectRandomElement(StickerPatterns);
    const [position, setPosition] = useState(getPosition);

    const updatePosition = () => setPosition(getPosition());

    const colorList = selectRandomElement(ColorLists);

    return (
        <Cube
            size="500px"
            stickers={position.stickers}
            colorList={colorList}
            onClick={updatePosition}
        />
    );
};

export default PllTrainer;
