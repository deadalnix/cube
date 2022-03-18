// @flow
import { type Node } from "react";

import HelloCube from "views/HelloCube";
import Pll from "views/Pll";

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
        icon: "tim-icons icon-app",
        Component: HelloCube,
    },
    {
        path: "pll",
        name: "PLL",
        icon: "tim-icons icon-app",
        Component: Pll,
    },
];

export default routes;
