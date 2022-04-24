// @flow
import { type Node, useState, useRef } from "react";

import Cube from "cube/svg/Cube";
import Face from "cube/svg/Face";
import { DefaultColorList, DefaultOrientation } from "cube/svg/Props";

import CubePLL, { type PllInfo, PllPatterns } from "cube/Pll";
import { type Stickers, makeDefaultStickers } from "cube/Stickers";

import ClientSide from "components/ClientSide";

import styles from "views/PllTrainer.scss";

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
    ])
    .map(c => Object.freeze(c));

function selectRandomElement<T>(a: Array<T>): T {
    return a[Math.floor(Math.random() * a.length)];
}

const useAnimation = (): [
    (number, (number) => void, () => void) => void,
    () => boolean
] => {
    const idRef = useRef<?AnimationFrameID>(null);
    const id = idRef.current;

    const cancel = (): boolean => {
        if (id == null) {
            return false;
        }

        cancelAnimationFrame(id);
        idRef.current = null;
        return true;
    };

    const start = (
        duration: number,
        step: number => void,
        onEnd: () => void
    ) => {
        // Just in case.
        cancel();

        const next = a => (idRef.current = requestAnimationFrame(a));

        const StartTime = performance.now();
        const animate = time => {
            const t = (time - StartTime) / duration;
            if (t >= 1) {
                cancel();
                onEnd();
                return;
            }

            next(animate);
            step(t);
        };

        next(animate);
    };

    return [start, cancel];
};

const PllCube = ({
    stickers,
    colorList,
    spin,
    onSpinEnd,
}: {
    stickers: Stickers,
    colorList: { [string]: string },
    spin: boolean,
    onSpinEnd: () => void,
}): Node => {
    const [orientation, setOrientation] = useState(DefaultOrientation);
    const [isSpinning, setIsSpinning] = useState(false);

    const [startAnimation, cancelAnimation] = useAnimation();

    if (!spin && isSpinning) {
        setIsSpinning(false);
        cancelAnimation();
    }

    if (spin && !isSpinning) {
        setIsSpinning(true);

        const From = (orientation.beta - 360) % 360;
        const To = DefaultOrientation.beta;

        const ANIMATION_TIME = 300;
        startAnimation(
            ANIMATION_TIME,
            t => {
                const i = t * (2 - t);
                setOrientation({
                    alpha: DefaultOrientation.alpha,
                    beta: From * (1 - i) + To * i,
                });
            },
            () => {
                // We reached our destination.
                setOrientation(DefaultOrientation);

                // We are done, wrap it up.
                setIsSpinning(false);
                onSpinEnd();
            }
        );
    }

    return (
        <Cube
            stickers={stickers}
            colorList={colorList}
            orientation={orientation}
            className={styles.cube}
        />
    );
};

const PllButton = ({
    pll,
    onClick,
}: {
    pll: PllInfo,
    onClick: () => void,
}): Node => (
    <button type="button" className={styles.faceButton} onClick={onClick}>
        <Face
            className={styles.cube}
            label={pll.name}
            stickers={pll.stickers}
        />
    </button>
);

const PllTrainer = (): Node => {
    const getPosition = () => selectRandomElement(StickerPatterns);
    const [position, setPosition] = useState(getPosition);

    const getColorList = () => selectRandomElement(ColorLists);
    const [colorList, setColorList] = useState(getColorList);

    const [spin, setSpin] = useState(false);

    const setNewPosition = () => {
        setPosition(getPosition());
        setColorList(getColorList());
    };

    const selectAnswer = pll => {
        if (pll === position.pll) {
            setSpin(true);
        }
    };

    // XXX: Object.values has type checking problems.
    const buttons = Object.values(CubePLL).map((pll: any) => (
        <PllButton key={pll.name} pll={pll} onClick={() => selectAnswer(pll)} />
    ));

    return (
        <div className={styles.container}>
            <div className={styles.topPanel}>
                <ClientSide>
                    <PllCube
                        stickers={position.stickers}
                        colorList={colorList}
                        spin={spin}
                        onSpinEnd={() => {
                            setSpin(false);
                            setNewPosition();
                        }}
                    />
                </ClientSide>
            </div>
            <div className={styles.buttonGrid}>{buttons}</div>
        </div>
    );
};

export default PllTrainer;
