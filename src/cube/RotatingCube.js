// @flow
import { useState, type Node } from "react";

import Quaternion, { Slerp } from "./Quaternion.js";
import SvgCube, { type CubeProps } from "./SvgCube.js";

type RotatingCubeProps = {
    ...?CubeProps,
    orientation?: {| alpha: number, beta: number |},
};

const RotatingCube = ({ orientation, ...props }: RotatingCubeProps): Node => {
    const [baseQ, setBaseQ] = useState(() => new Quaternion());
    const [currentQ, setCurrentQ] = useState(() => new Quaternion());

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

    const adjustQ = () => {
        const reduceAngle = a => {
            const aa = ((a - 45) % 90) + 45;
            return aa > 45 ? aa - 90 : aa;
        };

        // Check if alpha's value calls for an axis change.
        const alpha = angles.alpha;
        const newAlpha = reduceAngle(alpha);

        const deltaAlpha = newAlpha - alpha;
        if (Math.abs(deltaAlpha) < 1) {
            // We do not need to tweak the axis.
            return;
        }

        // Rotate the base to match beta.
        const beta = angles.beta;
        const newBeta = reduceAngle(beta);

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
    };

    const stopRotating = e => {
        setDragData(null);
        adjustQ();
    };

    const rotate = e => {
        // If we aren't rotating, just do nothing.
        if (!dragData) {
            return;
        }

        const speed = dragData.speed;
        const deltaX = (dragData.x - e.clientX) * speed;

        // It feels better to make the Y axis "snappy".
        let deltaY = (dragData.y - e.clientY) * speed;
        if (Math.abs(deltaY) < 12) {
            deltaY = 0;
        }

        setAngles({
            alpha: deltaY + dragData.alpha,
            beta: deltaX + dragData.beta,
        });
    };

    const rotation = currentQ.rotateY(angles.beta).rotateX(-angles.alpha);

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
