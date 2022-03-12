// @flow
import type { Node } from "react";
import { Point2D, midpoint } from "cube/Point";

export type FaceletProps = {
    vertices: [Point2D, Point2D, Point2D, Point2D],
    color: string,
    ...
};

export const Facelet = ({ vertices, color, ...props }: FaceletProps): Node => {
    // Find centre point of facelet
    const FaceletCenter = midpoint(vertices[0], vertices[2]);

    // Scale points in towards centre
    const FaceletScale = 0.9;
    const points = vertices.map(p => p.rescale(FaceletCenter, FaceletScale));

    // Generate facelet polygon
    return <polygon {...props} fill={color} stroke="#000000" points={points} />;
};

export type FaceletsProps = {|
    dimention: number,
    vertices: Array<Point2D>,
    colors: string,
    colorList: { [string]: string },
    rowCount?: number,
|};

const Facelets = ({
    dimention,
    vertices,
    colors,
    colorList,
    rowCount,
}: FaceletsProps): Node => {
    rowCount = rowCount ?? dimention;
    const Plans = dimention + 1;
    let facelets = [];
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < dimention; j++) {
            const Index = i * Plans + j;
            const P1 = vertices[Index];
            const P2 = vertices[Index + Plans];
            const P3 = vertices[Index + Plans + 1];
            const P4 = vertices[Index + 1];

            const ColorIndex = i * dimention + j;
            const Color = colorList[colors[ColorIndex]];

            // Generate facelet polygon
            facelets.push(
                <Facelet
                    key={ColorIndex}
                    vertices={[P1, P2, P3, P4]}
                    color={Color}
                />
            );
        }
    }

    return facelets;
};

export default Facelets;
