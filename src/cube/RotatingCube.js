// @flow
import { useState, type Node } from "react";

import Quaternion, { Slerp } from "cube/Quaternion";
import SvgCube, { type CubeProps } from "cube/SvgCube";

type RotatingCubeProps = {
    ...?CubeProps,
    orientation?: {| alpha: number, beta: number |},
};

const RotatingCube = ({ orientation, ...props }: RotatingCubeProps): Node => {
    const [baseQ, setBaseQ] = useState(() => Quaternion.unit());
    const [currentQ, setCurrentQ] = useState(() => Quaternion.unit());

    const [angles, setAngles] = useState(
        () => orientation ?? SvgCube.defaultProps.orientation
    );

    const [dragData, setDragData] = useState(null);
    const [animation, setAnimation] = useState(null);

    const getCapture = e => {
        let target = e.target;
        if (target.tagName !== "svg") {
            target = target.nearestViewportElement;
        }

        target.setPointerCapture(e.pointerId);

        const RotateSpeedFactor = 150;
        setDragData({
            x: e.clientX,
            y: e.clientY,
            alpha: angles.alpha,
            beta: angles.beta,
            speed: RotateSpeedFactor / target.clientWidth,
        });
    };

    const runAnimation = (from, to) => {
        // Make sure we finish any in flight animation.
        if (animation !== null) {
            clearInterval(animation);
            setAnimation(null);
        }

        const slerp = new Slerp(from, to);
        const StartTime = new Date().getTime();

        const id = setInterval(() => {
            const ANIMATION_TIME = 200;

            const time = new Date().getTime();
            const t = (time - StartTime) / ANIMATION_TIME;
            if (t < 1) {
                setCurrentQ(slerp.get(t));
                return;
            }

            // We reached our destination.
            setCurrentQ(to);

            // We are done, wrap it up.
            clearInterval(id);
            if (animation === id) {
                setAnimation(null);
            }
        }, 16);

        setAnimation(id);
    };

    const stopRotating = e => {
        setDragData(null);
    };

    const rotate = e => {
        // If we aren't rotating, just do nothing.
        if (!dragData) {
            return;
        }

        const speed = dragData.speed;
        const deltaX = (dragData.x - e.clientX) * speed;
        const beta = dragData.beta + deltaX;

        const reduceAngle = (a, s) => {
            const aa = ((a - s) % 90) + s;
            return aa > s ? aa - 90 : aa;
        };

        // Check if alpha's value calls for an axis change.
        let deltaY = (e.clientY - dragData.y) * speed;
        const alpha = dragData.alpha + deltaY;
        const newAlpha = reduceAngle(alpha, 55);

        const deltaAlpha = alpha - newAlpha;
        if (Math.abs(deltaAlpha) < 1) {
            // We do not need to tweak the axis.
            setAngles({
                alpha: alpha,
                beta: beta,
            });

            return;
        }

        // Rotate the base to match beta.
        const newBeta = reduceAngle(beta, 45);

        // New rotation after base adjustements.
        let newBase = baseQ.rotateY(beta - newBeta);

        // We change the axis controlled by beta.
        newBase = newBase.rotateX(deltaAlpha);
        setBaseQ(newBase);

        const newCurrent = currentQ.rotateY(beta).rotateX(deltaAlpha);
        setCurrentQ(newCurrent);

        runAnimation(newCurrent, newBase);

        setAngles({
            alpha: newAlpha,
            beta: 0,
        });

        setDragData({
            ...dragData,
            x: e.clientX,
            y: e.clientY,
            alpha: newAlpha,
            beta: 0,
        });
    };

    const rotation = currentQ.rotateY(angles.beta).rotateX(angles.alpha);

    return (
        <SvgCube
            {...props}
            orientation={rotation}
            onPointerDown={getCapture}
            onLostPointerCapture={stopRotating}
            onPointerMove={rotate}
        />
    );
};

export default RotatingCube;
