// @flow
const Theta = (angle: number) => (Math.PI * angle) / 360;

export type Orientation = Quaternion | {| alpha: number, beta: number |};

export class Quaternion {
    w: number = 1;
    x: number = 0;
    y: number = 0;
    z: number = 0;

    static fromOrientation(o: Orientation): Quaternion {
        if (o instanceof Quaternion) {
            return o;
        }

        return Quaternion.fromAngles(o.alpha, o.beta);
    }

    static fromAngles(alpha: number, beta: number): Quaternion {
        return new Quaternion().rotateY(beta).rotateX(-alpha);
    }

    static fromCoordinates(
        w: number,
        x: number,
        y: number,
        z: number
    ): Quaternion {
        const q = new Quaternion();

        q.w = w;
        q.x = x;
        q.y = y;
        q.z = z;

        return q;
    }

    combine(q: Quaternion): Quaternion {
        const qw = q.w;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return Quaternion.fromCoordinates(
            qw * tw - qx * tx - qy * ty - qz * tz,
            qx * tw + qw * tx + qy * tz - qz * ty,
            qy * tw + qw * ty + qz * tx - qx * tz,
            qz * tw + qw * tz + qx * ty - qy * tx
        );
    }

    rotateX(angle: number): Quaternion {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return Quaternion.fromCoordinates(
            C * tw - S * tx,
            C * tx + S * tw,
            C * ty - S * tz,
            C * tz + S * ty
        );
    }

    rotateY(angle: number): Quaternion {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return Quaternion.fromCoordinates(
            C * tw - S * ty,
            C * tx + S * tz,
            C * ty + S * tw,
            C * tz - S * tx
        );
    }

    rotateZ(angle: number): Quaternion {
        const T = Theta(angle);
        const C = Math.cos(T);
        const S = Math.sin(T);

        const tw = this.w;
        const tx = this.x;
        const ty = this.y;
        const tz = this.z;

        return Quaternion.fromCoordinates(
            C * tw - S * tz,
            C * tx - S * ty,
            C * ty + S * tx,
            C * tz + S * tw
        );
    }
}
