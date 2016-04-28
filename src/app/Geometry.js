class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getCoords() {
        return [this.x, this.y];
    }

    getLengthTo(p2) {
        let x = p2.x - this.x;
        let y = p2.y - this.y;

        return Math.sqrt(x * x + y * y);
    }
}

class Line {
    constructor(p1, p2) {
        if (!arguments.length) {
            return;
        }
        let A = p1.y - p2.y;
        let B = p2.x - p1.x;
        let C = p1.x*p2.y - p2.x*p1.y;

        let norm = Math.sqrt(A * A + B * B);
        A = A / norm;
        B = B / norm;
        C = C / norm;

        this.A = A;
        this.B = B;
        this.C = C;
    }

    getPointByX(x) {
        return - (this.C + this.A * x) / this.B;
    }

    getPointByY(y) {
        return - (this.C + this.B * y) / this.A;
    }

    intersect (line) {
        let det = this.A * line.B - line.A * this.B;
        let x = (this.B * line.C - line.B * this.C) / det;
        let y = (this.C * line.A - line.C * this.A) / det;

        return new Point(x, y);
    }

    shift(delta) {
        let line = new Line();
        line.A = this.A;
        line.B = this.B;
        line.C = this.C + delta;

        return line;
    }

    static horizontal(y) {
        let p1 = new Point(0, y);
        let p2 = new Point(1, y);

        return new Line(p1, p2);
    }

    static vertical(x) {
        let p1 = new Point(x, 0);
        let p2 = new Point(x, 1);

        return new Line(p1, p2);
    }
}

export {
    Point,
    Line,
};
