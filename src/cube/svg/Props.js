// @flow
import type { Stickers } from "cube/Stickers";

export const DefaultOrientation = {
    alpha: 25,
    beta: 45,
};

export type SvgProps = {
    dimention: number,
    size: string,
    colorList: { [string]: string },
    stickers?: Stickers,
};

export const DefaultSvgProps = {
    dimention: 3,
    size: "200px",
    colorList: {
        r: "#8c000f",
        u: "#ffd200",
        f: "#003373",
        l: "#ff4600",
        d: "#f8f8f8",
        b: "#00732f",
        h: "#707070",
        j: "#404040",
        k: "#999999",
        g: "#555555",
        v: "#600d75",
    },
};
