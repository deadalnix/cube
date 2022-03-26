// @flow
import { Point3D } from "math/Point";
import { type Face, objectMap } from "cube/CubeUtils";

// Produce point array for a cube in default position and cache it.
class VerticesCacheImpl {
    cache: { [number]: { [Face]: Array<Point3D> } } = {};

    get(dimention: number): { [Face]: Array<Point3D> } {
        if (dimention in this.cache) {
            return this.cache[dimention];
        }

        let v = { R: [], U: [], F: [], L: [], D: [], B: [] };

        // Fill the face vertices in the default orientation.
        for (let i = 0; i <= dimention; i++) {
            for (let j = 0; j <= dimention; j++) {
                v.R.push(new Point3D(dimention, i, j));
                v.U.push(new Point3D(j, 0, dimention - i));
                v.F.push(new Point3D(j, i, 0));
                v.L.push(new Point3D(0, i, dimention - j));
                v.D.push(new Point3D(j, dimention, i));
                v.B.push(new Point3D(dimention - j, i, dimention));
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
