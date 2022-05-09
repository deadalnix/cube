// @flow
import { type Node } from "react";

import cubeIcon from "@iconify/icons-charm/cube";
import pulseIcon from "@iconify/icons-charm/pulse";

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
        icon: cubeIcon,
        Component: HelloCube,
    },
    {
        path: "pll",
        name: "PLL",
        icon: cubeIcon,
        Component: Pll,
    },
    {
        path: "plltrainer",
        name: "PLL trainer",
        icon: pulseIcon,
        Component: PllTrainer,
    },
];

export default routes;
