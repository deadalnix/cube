// @flow
import {
    type Alg,
    type Moves,
    AlgVisitor,
    Move,
    Sequence,
    Conjugate,
    Commutator,
} from "cube/Alg";

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
        // Omit () if they are not needed.
        if (alg.count === 1 && alg instanceof Sequence) {
            return this.printSequence(alg.moves);
        }

        return this.visit(alg);
    }

    visit(alg: Alg): string {
        return appendCount(super.visit(alg), alg.count);
    }

    visitMove(m: Move): string {
        return m.move;
    }

    visitSequence(s: Sequence): string {
        return "(" + this.printSequence(s.moves) + ")";
    }

    printSequence(moves: Moves): string {
        return moves.map(a => this.visit(a)).join(" ");
    }

    visitConjugate(c: Conjugate): string {
        return "[" + this.print(c.setup) + ": " + this.print(c.moves) + "]";
    }

    visitCommutator(c: Commutator): string {
        return "[" + this.print(c.a) + ", " + this.print(c.b) + "]";
    }
}

const printAlg = (alg: Alg): string => new AlgPrinter().print(alg);
export default printAlg;
