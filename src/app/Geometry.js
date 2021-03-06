class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getCoords() {
        return [this.x, this.y];
    }

    getLengthTo(p2) {
        let x = this.x;
        let y = this.y;
        if (p2) {
            x = p2.x - x;
            y = p2.y - y;
        }

        return Math.sqrt(x * x + y * y);
    }

    normalize() {
        let l = Math.sqrt(this.x * this.x + this.y * this.y);

        return new Point(this.x / l, this.y / l);
    }

    shift(v) {
        const x = this.x + v.x;
        const y = this.y + v.y;
        return new Point(x, y);
    }

    mult(d) {
        const x = this.x * d;
        const y = this.y * d;
        return new Point(x, y);
    }

    rotate(angle, center) {
        let x = this.x;
        let y = this.y;
        if (center) {
            x = x - center.x;
            y = y - center.y;
        }
        const sin = Math.sin(Math.PI * angle / 180);
        const cos = Math.cos(Math.PI * angle / 180);
        let x0 = x * cos - y * sin;
        let y0 = x * sin + y * cos;
        if (center) {
            x0 = x0 + center.x;
            y0 = y0 + center.y;
        }
        return new Point(x0, y0);
    }

    static getMiddle(p0, p1, scale = 0.5) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const x = p0.x + dx * scale;
        const y = p0.y + dy * scale;
        return new Point(x, y);
    }

    static getVector(p0, p1) {
        const x = p1.x - p0.x;
        const y = p1.y - p0.y;
        return new Point(x, y);
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

        const norm = Math.sqrt(a * a + b * b);
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

    get norm() {
        return new Point(this.a, this.b);
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
