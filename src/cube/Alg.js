// @flow
export class Location {
    +start: number;
    +stop: number;

    constructor(start: number, stop: number) {
        this.start = start;
        this.stop = stop;
    }
}

export interface Alg {
    +location: Location;
    +count: number;

    accept<T>(v: AlgVisitor<T>): T;
}

/**
 * A simple puzzle move.
 */
export class Move implements Alg {
    +location: Location;
    +move: string;
    +count: number;

    constructor(location: Location, move: string, count: number) {
        this.location = location;
        this.move = move;
        this.count = count;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitMove(this);
    }
}

export class Sequence implements Alg {
    +location: Location;
    +moves: Array<Alg>;
    +count: number;

    constructor(location: Location, moves: Array<Alg>, count: number) {
        this.location = location;
        this.moves = Object.freeze(moves);
        this.count = count;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitSequence(this);
    }
}

export class Conjugate implements Alg {
    +location: Location;
    +setup: Alg;
    +moves: Alg;
    +count: number;

    constructor(location: Location, setup: Alg, moves: Alg, count: number) {
        this.location = location;
        this.setup = setup;
        this.moves = moves;
        this.count = count;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitConjugate(this);
    }
}

export class Commutator implements Alg {
    +location: Location;
    +a: Alg;
    +b: Alg;
    +count: number;

    constructor(location: Location, a: Alg, b: Alg, count: number) {
        this.location = location;
        this.a = a;
        this.b = b;
        this.count = count;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitCommutator(this);
    }
}

const unimplemented = <T>(o: AlgVisitor<T>, message: string): Error =>
    new Error(o.constructor.name + " does not support " + message);

export class AlgVisitor<T> {
    visit(alg: Alg): T {
        return alg.accept(this);
    }

    visitMove(m: Move): T {
        throw unimplemented(this, "Moves");
    }

    visitSequence(s: Sequence): T {
        throw unimplemented(this, "Sequences");
    }

    visitConjugate(c: Conjugate): T {
        throw unimplemented(this, "Conjugates");
    }

    visitCommutator(c: Commutator): T {
        throw unimplemented(this, "Commutators");
    }
}
