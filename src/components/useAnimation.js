// @flow
import { useRef } from "react";

const useAnimation = (): [
    (number, (number) => void, () => void) => void,
    () => boolean
] => {
    const idRef = useRef<?AnimationFrameID>(null);
    const id = idRef.current;

    const cancel = (): boolean => {
        if (id == null) {
            return false;
        }

        cancelAnimationFrame(id);
        idRef.current = null;
        return true;
    };

    const start = (
        duration: number,
        step: number => void,
        onEnd: () => void
    ) => {
        // Just in case.
        cancel();

        const next = a => (idRef.current = requestAnimationFrame(a));

        const StartTime = performance.now();
        const animate = time => {
            const t = (time - StartTime) / duration;
            if (t >= 1) {
                cancel();
                onEnd();
                return;
            }

            next(animate);
            step(t);
        };

        next(animate);
    };

    return [start, cancel];
};

export default useAnimation;
