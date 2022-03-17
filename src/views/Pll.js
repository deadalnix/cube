// @flow
import type { Node } from "react";
import Face from "cube/svg/Face";
import CubePLL, { type PllInfo } from "cube/Pll";
import { getStickersRotator } from "cube/Stickers";
import printAlg from "cube/AlgPrinter";
import invertAlg from "cube/AlgInverter";

import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Input,
    Row,
    Col,
} from "reactstrap";

import styles from "views/Pll.scss";

const PllCard = ({ pll: { name, alg } }: { pll: PllInfo }): Node => {
    const inv = invertAlg(alg);

    let sr = getStickersRotator(3);
    sr.runAlg(inv);

    return (
        <Card>
            <CardHeader>
                <CardTitle tag="h4">{name}</CardTitle>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col className="text-center">
                        <Face stickers={sr.getStickers()} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Input placeholder={printAlg(alg)} type="text" />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const PllGroup = ({ title, plls }): Node => (
    <Card className={"card-plain"}>
        <CardHeader>
            <CardTitle tag="h3">{title}</CardTitle>
        </CardHeader>
        <CardBody>
            <Row>
                {plls.map(p => (
                    <Col md="3" key={p.name} className={styles.algCell}>
                        <PllCard pll={p} />
                    </Col>
                ))}
            </Row>
        </CardBody>
    </Card>
);

const Pll = (): Node => (
    <>
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
    </>
);

export default Pll;
