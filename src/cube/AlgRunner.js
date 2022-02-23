// @flow
import {
    type Alg,
    AlgVisitor,
    Location,
    Move,
    Sequence,
    Conjugate,
    Commutator,
} from "./Alg.js";

type AlgRunnerCallback = (Location, string, number) => void;

class AlgRunner extends AlgVisitor<void> {
    +callback: AlgRunnerCallback;
    #multiplier: number = 1;

    constructor(callback: AlgRunnerCallback) {
        super();

        this.callback = callback;
    }

    visit(a: Alg): void {
        if (a.count === 0) {
            return;
        }

        super.visit(a);
    }

    withMultiplier(fun: () => void, newMultiplier: number): void {
        let oldMultiplier = this.#multiplier;
        this.#multiplier = newMultiplier;

        try {
            fun();
        } finally {
            this.#multiplier = oldMultiplier;
        }
    }

    visitReverse(a: Alg): void {
        this.withMultiplier(() => {
            this.visit(a);
        }, -this.#multiplier);
    }

    runOnAlg(alg: Alg, forward: () => void, backward: () => void): void {
        const multiplier = this.#multiplier;
        const count = alg.count * multiplier;
        const total = Math.abs(count);
        const fun = count > 0 ? forward : backward;

        this.withMultiplier(() => {
            for (let i = 0; i < total; i++) {
                fun();
            }
        }, 1);
    }

    visitMove(m: Move): void {
        this.callback(m.location, m.move, m.count * this.#multiplier);
    }

    visitSequence(s: Sequence): void {
        this.runOnAlg(
            s,
            () => s.moves.forEach(a => this.visit(a)),
            () => [...s.moves].reverse().forEach(a => this.visitReverse(a))
        );
    }

    visitConjugate(c: Conjugate): void {
        const makeSetup = (fun: Alg => void) => () => {
            this.visit(c.setup);
            fun(c.moves);
            this.visitReverse(c.setup);
        };

        this.runOnAlg(
            c,
            makeSetup(a => this.visit(a)),
            makeSetup(a => this.visitReverse(a))
        );
    }

    visitCommutator(c: Commutator): void {
        const commute = (a: Alg, b: Alg) => {
            this.visit(a);
            this.visit(b);
            this.visitReverse(a);
            this.visitReverse(b);
        };

        this.runOnAlg(
            c,
            () => commute(c.a, c.b),
            () => commute(c.b, c.a)
        );
    }
}

const runAlg = (alg: Alg, callback: AlgRunnerCallback): void =>
    new AlgRunner(callback).visit(alg);

export default runAlg;
