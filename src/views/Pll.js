// @flow
import type { Node } from "react";
import Face from "cube/svg/Face";
import CubePLL, { type PllInfo } from "cube/Pll";
import { getStickersRotator } from "cube/Stickers";
import printAlg from "cube/AlgPrinter";
import invertAlg from "cube/AlgInverter";

import styles from "views/Pll.scss";

const PllCard = ({ pll: { name, alg } }: { pll: PllInfo }): Node => {
    const inv = invertAlg(alg);

    let sr = getStickersRotator(3);
    sr.runAlg(inv);

    return (
        <div className={styles.pllCard}>
            <Face
                className={styles.face}
                label={name}
                stickers={sr.getStickers()}
            />
            <input type="text" placeholder={printAlg(alg)} />
        </div>
    );
};

const PllGroup = ({ title, plls }): Node => (
    <>
        <h3>{title}</h3>
        {plls.map(p => (
            <PllCard key={p.name} pll={p} />
        ))}
    </>
);

const Pll = (): Node => (
    <div className={styles.pllGrid}>
        <PllGroup
            title="EPLL"
            plls={[CubePLL.H, CubePLL.Ua, CubePLL.Ub, CubePLL.Z]}
        />
        <PllGroup title="CPLL" plls={[CubePLL.Aa, CubePLL.Ab, CubePLL.E]} />
        <PllGroup
            title="Adjacent swaps"
            plls={[
                CubePLL.T,
                CubePLL.F,
                CubePLL.Ja,
                CubePLL.Jb,
                CubePLL.Ra,
                CubePLL.Rb,
            ]}
        />
        <PllGroup
            title="G perms"
            plls={[CubePLL.Ga, CubePLL.Gb, CubePLL.Gc, CubePLL.Gd]}
        />
        <PllGroup
            title="Diagonal swaps"
            plls={[CubePLL.Y, CubePLL.V, CubePLL.Na, CubePLL.Nb]}
        />
    </div>
);

export default Pll;
