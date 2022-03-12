// @flow
import type { Node } from "react";
import { Point2D } from "cube/Point";

export type OutlineProps = {
    vertices: [Point2D, Point2D, Point2D, Point2D],
    ...
};

const Outline = ({ vertices, ...props }: OutlineProps): Node => {
    const OutlineScale = 0.95;
    const points = vertices.map(p => p.scale(OutlineScale));
    return (
        <polygon {...props} fill="#000000" stroke="#000000" points={points} />
    );
};

export default Outline;
