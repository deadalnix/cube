// @flow
import { type Node } from "react";

import { faCube, faGamepad } from "@fortawesome/free-solid-svg-icons";

import HelloCube from "views/HelloCube";
import Pll from "views/Pll";
import PllTrainer from "views/PllTrainer";

export type Route = {|
    path: string,
    name: string,
    icon: string,
    Component: () => Node,
|};

const routes: Array<Route> = [
    {
        path: "",
        name: "Cube",
        icon: faCube,
        Component: HelloCube,
    },
    {
        path: "pll",
        name: "PLL",
        icon: faCube,
        Component: Pll,
    },
    {
        path: "plltrainer",
        name: "PLL trainer",
        icon: faGamepad,
        Component: PllTrainer,
    },
];

export default routes;
