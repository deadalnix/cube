// @flow
import { type Node, useState } from "react";

import Cube from "cube/svg/Cube";
import Face from "cube/svg/Face";
import { DefaultColorList } from "cube/svg/Props";

import CubePLL, { type PllInfo, PllPatterns } from "cube/Pll";
import { makeDefaultStickers } from "cube/Stickers";
import { objectMap } from "cube/CubeUtils";

import ClientSide from "components/ClientSide";

import {
    Row,
    Col,
    Button,
    Card,
    CardHeader,
    CardTitle,
    CardBody,
} from "reactstrap";

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

const PllCard = ({
    pll,
    onClick,
}: {
    pll: PllInfo,
    onClick: () => void,
}): Node => (
    <Button
        className="text-center"
        style={{ width: "125px" }}
        onClick={onClick}
    >
        <Row>
            <Col>
                <Face size="100%" stickers={pll.stickers} />
            </Col>
        </Row>
        <Row>
            <Col>{pll.name}</Col>
        </Row>
    </Button>
);

const PllTrainer = (): Node => {
    const getPosition = () => selectRandomElement(StickerPatterns);
    const [position, setPosition] = useState(getPosition);

    const getColorList = () => selectRandomElement(ColorLists);
    const [colorList, setColorList] = useState(getColorList);

    const setNewPosition = () => {
        setPosition(getPosition());
        setColorList(getColorList());
    };

    const selectAnswer = pll => {
        if (pll === position.pll) {
            setNewPosition();
        }
    };

    const buttons = objectMap(CubePLL, pll => (
        <PllCard key={pll.name} pll={pll} onClick={() => selectAnswer(pll)} />
    ));

    return (
        <Row>
            <Col md="6" className="text-center">
                <ClientSide>
                    <Cube stickers={position.stickers} colorList={colorList} />
                </ClientSide>
            </Col>
            <Col md="6">
                <Card className={"card-plain"}>
                    <CardHeader>
                        <CardTitle tag="h3">PLL recognition trainer</CardTitle>
                    </CardHeader>
                    <CardBody>{Object.values(buttons)}</CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default PllTrainer;
