// @flow
import { type Node, useState } from "react";

import Cube from "cube/svg/Cube";
import Face from "cube/svg/Face";
import { DefaultColorList, DefaultOrientation } from "cube/svg/Props";

import CubePLL, { type PllInfo, PllPatterns } from "cube/Pll";
import { type Stickers, makeDefaultStickers } from "cube/Stickers";

import ClientSide from "components/ClientSide";
import useAnimation from "components/useAnimation";

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

type CubeAnimation = null | "spin" | "shake";

const PllCube = ({
    stickers,
    colorList,
    animation,
    onAnimationEnd,
}: {
    stickers: Stickers,
    colorList: { [string]: string },
    animation: CubeAnimation,
    onAnimationEnd: () => void,
}): Node => {
    const [beta, setBeta] = useState(DefaultOrientation.beta);
    const [position, setPosition] = useState(0);

    const [startAnimation, cancelAnimation] = useAnimation();
    const [currentAnimation, setCurrentAnimation] =
        useState<CubeAnimation>(null);

    const DefaultBeta = DefaultOrientation.beta;

    const startSpinning = () => {
        const ANIMATION_TIME = 300;
        const from = (beta - 360) % 360;
        const to = DefaultBeta;

        startAnimation(
            ANIMATION_TIME,
            t => {
                const i = t * (2 - t);
                setBeta(from * (1 - i) + to * i);
            },
            () => {
                // We reached our destination.
                setBeta(to);

                // We are done, wrap it up.
                onAnimationEnd();
            }
        );
    };

    const startShaking = () => {
        const ANIMATION_TIME = 200;
        startAnimation(
            ANIMATION_TIME,
            t => setPosition(8 * t * (1 - t) * Math.sin(4 * Math.PI * t)),
            () => {
                // We reached our destination.
                setPosition(0);

                // We are done, wrap it up.
                onAnimationEnd();
            }
        );
    };

    if (animation !== currentAnimation) {
        setCurrentAnimation(animation);
        switch (animation) {
            case "spin":
                setPosition(0);
                startSpinning();
                break;

            case "shake":
                setBeta(DefaultBeta);
                startShaking();
                break;

            default:
                cancelAnimation();
        }
    }

    return (
        <Cube
            stickers={stickers}
            colorList={colorList}
            orientation={{
                alpha: DefaultOrientation.alpha,
                beta: beta,
            }}
            className={styles.cube}
            style={{
                transform: `translateX(${position}%)`,
            }}
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

    const [cubeAnimation, setCubeAnimation] = useState(null);

    const setNewPosition = () => {
        setPosition(getPosition());
        setColorList(getColorList());
    };

    const selectAnswer = pll => () =>
        setCubeAnimation(pll === position.pll ? "spin" : "shake");

    // XXX: Object.values has type checking problems.
    const buttons = Object.values(CubePLL).map((pll: any) => (
        <PllButton key={pll.name} pll={pll} onClick={selectAnswer(pll)} />
    ));

    return (
        <div className={styles.container}>
            <div className={styles.topPanel}>
                <ClientSide>
                    <PllCube
                        stickers={position.stickers}
                        colorList={colorList}
                        animation={cubeAnimation}
                        onAnimationEnd={() => {
                            setCubeAnimation(null);

                            // If the animationw as a spin,
                            // then we found the solution.
                            if (cubeAnimation === "spin") {
                                setNewPosition();
                            }
                        }}
                    />
                </ClientSide>
            </div>
            <div className={styles.buttonGrid}>{buttons}</div>
        </div>
    );
};

export default PllTrainer;
