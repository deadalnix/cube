// @flow
import {
    type Alg,
    AlgVisitor,
    Move,
    Sequence,
    Conjugate,
    Commutator,
} from "cube/Alg";

import { getDirection } from "cube/CubeUtils";

class AlgInverter extends AlgVisitor<Alg> {
    visitMove(m: Move): Move {
        const d = getDirection(-m.count);
        return m.count === d ? m : new Move(m.location, m.move, d);
    }

    visitSequence(s: Sequence): Sequence {
        if (s.count < 0) {
            return new Sequence(s.location, s.moves, -s.count);
        }

        return new Sequence(
            s.location,
            [...s.moves].reverse().map(a => this.visit(a)),
            s.count
        );
    }

    visitConjugate(c: Conjugate): Conjugate {
        return c.count < 0
            ? new Conjugate(c.location, c.setup, c.moves, -c.count)
            : new Conjugate(c.location, c.setup, this.visit(c.moves), c.count);
    }

    visitCommutator(c: Commutator): Commutator {
        return c.count < 0
            ? new Commutator(c.location, c.a, c.b, -c.count)
            : new Commutator(c.location, c.b, c.a, c.count);
    }
}

const invertAlg = (alg: Alg): Alg => new AlgInverter().visit(alg);
export default invertAlg;
