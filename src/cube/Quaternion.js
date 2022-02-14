// @flow
import type { Point3D } from "./Point.js";

const Theta = (angle: number) => (Math.PI * angle) / 360;

export class Quaternion {
    w: number = 1;
    x: number = 0;
    y: number = 0;
    z: number = 0;

    rotate(p: Point3D): Point3D {
        const qw = this.w;
        const qx = this.x;
        const qy = this.y;
        const qz = this.z;

        const [vx, vy, vz] = p;

        // t = 2q x v
        const tx = 2 * (qy * vz - qz * vy);
        const ty = 2 * (qz * vx - qx * vz);
        const tz = 2 * (qx * vy - qy * vx);

        return [
            vx + qw * tx + qy * tz - qz * ty,
            vy + qw * ty + qz * tx - qx * tz,
            vz + qw * tz + qx * ty - qy * tx,
        ];
    }

    combine(q: Quaternion): this {
        const qw = q.w;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        this.w = qw * tw + qx * tx + qy * ty + qz * tz;
        this.x = qx * tw + qw * tx + qy * tz - qz * ty;
        this.y = qy * tw + qw * ty + qz * tx - qx * tz;
        this.z = qz * tw + qw * tz + qx * ty - qy * tx;

        return this;
    }

    rotateX(angle: number): this {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        this.w = C * tw + S * tx;
        this.x = C * tx + S * tw;
        this.y = C * ty - S * tz;
        this.z = C * tz + S * ty;

        return this;
    }

    rotateY(angle: number): this {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        this.w = C * tw + S * ty;
        this.x = C * tx + S * tz;
        this.y = C * ty + S * tw;
        this.z = C * tz - S * tx;

        return this;
    }

    rotateZ(angle: number): this {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        this.w = C * tw + S * tz;
        this.x = C * tx - S * ty;
        this.y = C * ty + S * tx;
        this.z = C * tz + S * tw;

        return this;
    }
}
