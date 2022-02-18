// @flow
const Theta = (angle: number) => (Math.PI * angle) / 360;

export type Orientation = Quaternion | {| alpha: number, beta: number |};

opaque type QuaternionCoordiates = [number, number, number, number];

export default class Quaternion {
    +w: number = 1;
    +x: number = 0;
    +y: number = 0;
    +z: number = 0;

    constructor(coords: ?QuaternionCoordiates) {
        if (coords) {
            this.w = coords[0];
            this.x = coords[1];
            this.y = coords[2];
            this.z = coords[3];
        }
    }

    static fromOrientation(o: Orientation): Quaternion {
        if (o instanceof Quaternion) {
            return o;
        }

        return Quaternion.fromAngles(o.alpha, o.beta);
    }

    static fromAngles(alpha: number, beta: number): Quaternion {
        return new Quaternion().rotateY(beta).rotateX(-alpha);
    }

    scale(f: number): Quaternion {
        return new Quaternion([this.w * f, this.x * f, this.y * f, this.z * f]);
    }

    multyply(q: Quaternion): Quaternion {
        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        const qw = q.w;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;

        return new Quaternion([
            tw * qw - tx * qx - ty * qy - tz * qz,
            tx * qw + tw * qx + ty * qz - tz * qy,
            ty * qw + tw * qy + tz * qx - tx * qz,
            tz * qw + tw * qz + tx * qy - ty * qx,
        ]);
    }

    combine(q: Quaternion): Quaternion {
        return q.multyply(this);
    }

    rotateX(angle: number): Quaternion {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return new Quaternion([
            C * tw - S * tx,
            C * tx + S * tw,
            C * ty - S * tz,
            C * tz + S * ty,
        ]);
    }

    rotateY(angle: number): Quaternion {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return new Quaternion([
            C * tw - S * ty,
            C * tx + S * tz,
            C * ty + S * tw,
            C * tz - S * tx,
        ]);
    }

    rotateZ(angle: number): Quaternion {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return new Quaternion([
            C * tw - S * tz,
            C * tx - S * ty,
            C * ty + S * tx,
            C * tz + S * tw,
        ]);
    }
}

export class Slerp {
    +a: Quaternion;
    +b: Quaternion;

    +cos: number;
    +theta: number;
    +isin: number;

    constructor(a: Quaternion, b: Quaternion) {
        let cos = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
        if (cos < 0) {
            cos = -cos;
            b = b.scale(-1);
        }

        this.a = a;
        this.b = b;
        this.cos = cos;
        this.theta = Math.acos(cos);
        this.isin = 1 / Math.sqrt(1 - cos * cos);
    }

    get(t: number): Quaternion {
        // Interpolate linearly when the angle is very small
        // to avoid singularities.
        let fa = 1 - t;
        let fb = t;

        // If the angle is larger, then use trigo.
        if (this.isin < 1000) {
            const ttheta = t * this.theta;
            const tcos = Math.cos(ttheta);
            const tsin = Math.sin(ttheta);

            fb = tsin * this.isin;
            fa = tcos - this.cos * fb;
        }

        const a = this.a;
        const b = this.b;

        return new Quaternion([
            a.w * fa + b.w * fb,
            a.x * fa + b.x * fb,
            a.y * fa + b.y * fb,
            a.z * fa + b.z * fb,
        ]);
    }
}
