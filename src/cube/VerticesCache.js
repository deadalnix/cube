// @flow
import { Point3D } from "cube/Point";
import { type Face, objectMap } from "cube/CubeUtils";

// Produce point array for a cube in default position and cache it.
class VerticesCacheImpl {
    cache: { [number]: { [Face]: Array<Point3D> } } = {};

    get(dimention: number): { [Face]: Array<Point3D> } {
        if (dimention in this.cache) {
            return this.cache[dimention];
        }

        const StickersPerFace = dimention * dimention;
        let v = {
            R: Array(StickersPerFace),
            U: Array(StickersPerFace),
            F: Array(StickersPerFace),
            L: Array(StickersPerFace),
            D: Array(StickersPerFace),
            B: Array(StickersPerFace),
        };

        // Fill the face vertices in the default orientation.
        for (let i = 0; i <= dimention; i++) {
            for (let j = 0; j <= dimention; j++) {
                const Index = i * dimention + i + j;
                v.R[Index] = new Point3D(dimention, i, j);
                v.U[Index] = new Point3D(j, 0, dimention - i);
                v.F[Index] = new Point3D(j, i, 0);
                v.L[Index] = new Point3D(0, i, dimention - j);
                v.D[Index] = new Point3D(j, dimention, i);
                v.B[Index] = new Point3D(dimention - j, i, dimention);
            }
        }

        // Recenter the point and scale based on dimention.
        const CenterOffset = -dimention / 2;
        const Scale = 1 / dimention;

        return (this.cache[dimention] = Object.freeze(
            objectMap(v, pf => pf.map(p => p.offset(CenterOffset, Scale)))
        ));
    }
}

const VerticesCache: VerticesCacheImpl = new VerticesCacheImpl();

export default VerticesCache;
