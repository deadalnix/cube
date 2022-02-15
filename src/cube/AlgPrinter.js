// @flow
import {
    type Alg,
    AlgVisitor,
    Move,
    Repeat,
    Sequence,
    Conjugate,
    Commutator,
} from "./Alg.js";

const appendCount = (alg: string, count: number): string => {
    const acount = Math.abs(count);
    if (acount !== 1) {
        alg += acount;
    }

    if (count < 0) {
        alg += "'";
    }

    return alg;
};

class AlgPrinter extends AlgVisitor<string> {
    print(alg: Alg): string {
        return alg instanceof Sequence
            ? this.printSequence(alg.moves)
            : this.visit(alg);
    }

    visitMove(m: Move): string {
        return appendCount(m.move, m.count);
    }

    visitRepeat(r: Repeat): string {
        return appendCount(this.visit(r.moves), r.count);
    }

    visitSequence(s: Sequence): string {
        return "(" + this.printSequence(s.moves) + ")";
    }

    printSequence(algs: Array<Alg>): string {
        return algs.map(a => this.visit(a)).join(" ");
    }

    visitConjugate(c: Conjugate): string {
        return "[" + this.print(c.setup) + ", " + this.print(c.moves) + "]";
    }

    visitCommutator(c: Commutator): string {
        return "[" + this.print(c.a) + ": " + this.print(c.b) + "]";
    }
}

const printAlg = (alg: Alg): string => new AlgPrinter().print(alg);
export default printAlg;
