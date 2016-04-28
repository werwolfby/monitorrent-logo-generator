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

class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    get center() {
        return new Point(this.x, this.y);
    }
}

class Line {
    constructor(p1, p2) {
        if (!arguments.length) {
            return;
        }
        let a = p1.y - p2.y;
        let b = p2.x - p1.x;
        let c = p1.x*p2.y - p2.x*p1.y;

        let norm = Math.sqrt(a * a + b * b);
        a = a / norm;
        b = b / norm;
        c = c / norm;

        this.a = a;
        this.b = b;
        this.c = c;
    }

    getPointByX(x) {
        return - (this.c + this.a * x) / this.b;
    }

    getPointByY(y) {
        return - (this.c + this.b * y) / this.a;
    }

    intersect (item) {
        const prototype = Object.getPrototypeOf(item);
        if (prototype === Line.prototype) {
            return this.intersectLine(item);
        }
        if (prototype === Circle.prototype) {
            return this.intersectCircle(item);
        }

        throw new Error("Ukhown type of item: " + (typeof item));
    }

    intersectLine (line) {
        let det = this.a * line.b - line.a * this.b;
        let x = (this.b * line.c - line.b * this.c) / det;
        let y = (this.c * line.a - line.c * this.a) / det;

        return new Point(x, y);
    }

    intersectCircle (circle) {
        const r = circle.r;
        const d = this.distance(circle);
        if (d > r) {
            return [];
        }

        const cx = circle.x;
        const cy = circle.y;
        const line = this.shift(new Point(-cx, -cy));

        const mult = Math.sqrt(r * r - d * d);

        let x0 = - (line.a * line.c);
        let y0 = - (line.b * line.c);

        const xa = x0 + line.b * mult;
        const ya = y0 - line.a * mult;
        const xb = x0 - line.b * mult;
        const yb = y0 + line.a * mult;

        let p0 = new Point(xa + cx, ya + cy);
        let p1 = new Point(xb + cx, yb + cy);

        return [p0, p1];
    }

    distance(item) {
        if (Object.getPrototypeOf(item) === Circle.prototype) {
            item = item.center;
        }

        return this.distancePoint(item);
    }

    distancePoint(point) {
        return this.a * point.x + this.b * point.y + this.c;
    }

    shift(delta) {
        if (Object.getPrototypeOf(delta) === Point.prototype) {
            delta = - (this.a * delta.x + this.b * delta.y);
        }

        if (typeof delta === "number") {
            let line = new Line();
            line.a = this.a;
            line.b = this.b;
            line.c = this.c + delta;

            return line;
        }

        throw new Error("Ukhown type of delta: " + (typeof delta));
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
    Circle,
    Line,
};
