// @flow
import { type Node } from "react";

import HelloCube from "views/HelloCube";

export type Route = {|
    path: string,
    name: string,
    icon: string,
    Component: () => Node,
|};

const routes: Array<Route> = [
    {
        path: "cube",
        name: "Cube",
        icon: "tim-icons icon-app",
        Component: HelloCube,
    },
];

export default routes;
