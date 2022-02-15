// @flow
import Quaternion from "./Quaternion.js";

export class Point2D {
    #x: number;
    #y: number;

    get x(): number {
        return this.#x;
    }

    get y(): number {
        return this.#y;
    }

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }

    // Useful to stuff them into SVG tags.
    toString(): string {
        return this.x + "," + this.y;
    }

    // Scale a point relative to the center of the view.
    scale(f: number): Point2D {
        return new Point2D(this.x * f, this.y * f);
    }

    // Scale point relative to origin
    rescale(o: Point2D, f: number): Point2D {
        const ox = o.x;
        const oy = o.y;
        return new Point2D((this.x - ox) * f + ox, (this.y - oy) * f + oy);
    }
}

export const midpoint = (p: Point2D, q: Point2D): Point2D =>
    new Point2D((p.x + q.x) / 2, (p.y + q.y) / 2);

export class Point3D {
    #x: number;
    #y: number;
    #z: number;

    get x(): number {
        return this.#x;
    }

    get y(): number {
        return this.#y;
    }

    get z(): number {
        return this.#z;
    }

    constructor(x: number, y: number, z: number) {
        this.#x = x;
        this.#y = y;
        this.#z = z;
    }

    offset(o: number, f: number): Point3D {
        return new Point3D(
            (this.x + o) * f,
            (this.y + o) * f,
            (this.z + o) * f
        );
    }

    project(d: number): Point2D {
        let z = this.z + d;
        return new Point2D((this.x * d) / z, (this.y * d) / z);
    }

    rotateZ(q: Quaternion): number {
        const px = this.x;
        const py = this.y;
        const pz = this.z;

        const qw = q.w;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;

        // t = 2q x p
        const tx = 2 * (qy * pz - qz * py);
        const ty = 2 * (qz * px - qx * pz);
        const tz = 2 * (qx * py - qy * px);

        return pz + qw * tz + qx * ty - qy * tx;
    }

    rotate(q: Quaternion): Point3D {
        const px = this.x;
        const py = this.y;
        const pz = this.z;

        const qw = q.w;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;

        // t = 2q x p
        const tx = 2 * (qy * pz - qz * py);
        const ty = 2 * (qz * px - qx * pz);
        const tz = 2 * (qx * py - qy * px);

        return new Point3D(
            px + qw * tx + qy * tz - qz * ty,
            py + qw * ty + qz * tx - qx * tz,
            pz + qw * tz + qx * ty - qy * tx
        );
    }
}
