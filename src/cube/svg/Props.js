// @flow
import type { Stickers } from "cube/Stickers";

export const DefaultOrientation = Object.freeze({
    alpha: 25,
    beta: 45,
});

export const DefaultColorList: { [string]: string } = Object.freeze({
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
});

export type SvgProps = {
    dimention: number,
    size: string,
    colorList: { [string]: string },
    stickers?: Stickers,
};

export const DefaultSvgProps = Object.freeze({
    dimention: 3,
    size: "500px",
    colorList: DefaultColorList,
});
