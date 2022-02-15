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

export class Repeat implements Alg {
    +location: Location;
    +moves: Alg;
    +count: number;

    constructor(location: Location, moves: Alg, count: number) {
        this.location = location;
        this.moves = moves;
        this.count = count;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitRepeat(this);
    }
}

export class Sequence implements Alg {
    +location: Location;
    +moves: Array<Alg>;

    constructor(location: Location, moves: Array<Alg>) {
        this.location = location;
        this.moves = moves;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitSequence(this);
    }
}

export class Conjugate implements Alg {
    +location: Location;
    +setup: Alg;
    +moves: Alg;

    constructor(location: Location, setup: Alg, moves: Alg) {
        this.location = location;
        this.setup = setup;
        this.moves = moves;
    }

    accept<T>(v: AlgVisitor<T>): T {
        return v.visitConjugate(this);
    }
}

export class Commutator implements Alg {
    +location: Location;
    +a: Alg;
    +b: Alg;

    constructor(location: Location, a: Alg, b: Alg) {
        this.location = location;
        this.a = a;
        this.b = b;
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

    visitRepeat(r: Repeat): T {
        throw unimplemented(this, "Repeats");
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
