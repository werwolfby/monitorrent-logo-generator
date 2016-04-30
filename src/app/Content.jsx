import React from 'react';
import Paper from 'material-ui/lib/paper';
import { Point, Circle, Line } from "./Geometry";

class Content extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        let rotate = `rotate(${this.props.hammer.rotate} ${this.props.hammer.cx * 192} ${this.props.hammer.cy * 192})`;

        let hammer = this._getHammerPath(this.props.hammer, this.props.hammerAdorner);

        let hammerPath = hammer.path;
        this._scale(hammerPath);
        hammerPath = hammerPath.join(' ');

        let hammerAdorner = null;
        if (hammer.adorner) {
            this._scale(hammer.adorner);
            hammerAdorner = (<path d={hammer.adorner.join(' ')} transform={rotate} stroke="red" fill="none"/>);
        }

        let support = this._getSupportPath(this.props.support, this.props.supportAdorner);

        let supportPath = support.path;
        this._scale(supportPath);
        supportPath = support.path.join(' ');

        let supportAdorner = null;
        if (support.adorner) {
            this._scale(support.adorner);
            supportAdorner = (<path d={support.adorner.join(' ')} stroke="red" fill="none"/>);
        }

        let hammerSvg = (<path d={hammerPath} transform={rotate} stroke="black" fill="white"/>);
        let supportSvg = (<path d={supportPath} stroke="black" fill="white"/>);

        return (
            <Paper style={{width: this.props.size, height: this.props.size}}>
                <svg xmlns="http://www.w3.org/svg/2000"
                    viewBox={"0 0 192 192"} width={this.props.size} height={this.props.size}>
                    {hammerSvg}
                    {supportSvg}
                    {hammerAdorner}
                    {supportAdorner}
                </svg>
            </Paper>
        );
    }

    _scale(path) {
        for (let i = 0; i < path.length; i++) {
            if (typeof path[i] === 'number') {
                path[i] = path[i] * 192;
            }
        }
    }

    // Walking Beam
    _getHammerPath(state, adornerName) {
        /*              p2 p2m p3
         * b0--b1        |       \
         *     p0-l0--- p1       |
         * b0m p0m  z   p1m      p4
         *     p8-l7--- p7       |
         * b3--b2        |       /
         *              p6 p5m p5
         * */
        let zcx = state.cx;
        let zcy = state.cy;
        let top2 = state.headType === 2 ? state.headTop2 : state.headTop;
        let headLength = top2 + state.headBottom;

        let thickness1 = state.headThickness;
        let thickness2 = state.headType === 2 ? state.headThickness2 : thickness1;

        let bulbShift = 0;
        if (state.bulb) {
            bulbShift = state.bulbWidth;
        }

        let p0 = new Point(zcx - state.left + bulbShift, zcy - state.thickness / 2);
        let p1 = new Point(zcx + state.right, zcy - state.thickness / 2);
        let p2 = new Point(zcx + state.right, zcy - state.headTop);
        let p3 = new Point(zcx + state.right + thickness1, zcy - top2);
        let p4 = new Point(zcx + state.right + thickness1 + state.headQdx * headLength,
                           zcy - top2 + state.headQdy * headLength);
        let p5 = new Point(zcx + state.right + thickness2, zcy + state.headBottom);
        let p6 = new Point(zcx + state.right, zcy + state.headBottom);
        let p7 = new Point(zcx + state.right, zcy + state.thickness / 2);
        let p8 = new Point(zcx - state.left + bulbShift, zcy + state.thickness / 2);

        let b0 = new Point(zcx - state.left, zcy - state.bulbThickness / 2);
        let b1 = new Point(p0.x, zcy - state.bulbThickness / 2);
        let b2 = new Point(p0.x, zcy + state.bulbThickness / 2);
        let b3 = new Point(zcx - state.left, zcy + state.bulbThickness / 2);

        let l0 = new Line(p0, p1);
        let l7 = new Line(p7, p8);

        let p0m = Point.getMiddle(p0, p8);
        let p1m = Point.getMiddle(p1, p7);
        let p2m = Point.getMiddle(p2, p3);
        let p5m = Point.getMiddle(p6, p5);

        let b0m = Point.getMiddle(b0, b3);


        let circle1Top = [], circle1Bottom = [];

        if (state.circle1 && state.circle1Radius > state.thickness / 2) {
            let circle = new Circle(zcx, zcy, state.circle1Radius);

            let iTop = l0.intersect(circle).sort((a, b) => a.x - b.x);
            circle1Top = [
                'L', ...iTop[0].getCoords(),
                'A', state.circle1Radius, state.circle1Radius, 0, 0, 1 / 192, ...iTop[1].getCoords(),
            ];

            let iBottom = l7.intersect(circle).sort((a, b) => b.x - a.x);
            circle1Bottom = [
                'L', ...iBottom[0].getCoords(),
                'A', state.circle1Radius, state.circle1Radius, 0, 0, 1 / 192, ...iBottom[1].getCoords(),
            ];
        }

        let closeBulb = [], openBulb = [];

        if (state.bulbClose) {
            closeBulb = [
                'M', ...b2.getCoords(),
                'L', ...b3.getCoords(),
                'L', ...b0.getCoords(),
                'L', ...b1.getCoords(),
                'Z',
            ];
        } else {
            openBulb = [
                'L', ...b2.getCoords(),
                'L', ...b3.getCoords(),
                'L', ...b0.getCoords(),
                'L', ...b1.getCoords(),
            ];
        }

        let shaft = [
            'M', ...p7.getCoords(),
            ...circle1Bottom,
            'L', ...p8.getCoords(),
            // when bulb is closed then it will be empty and do nothing
            // otherwise it will continue draw bulb
            ...openBulb,
            'L', ...p0.getCoords(),
            ...circle1Top,
            'L', ...p1.getCoords(),
        ];
        if (state.close) {
            shaft.push('Z');
        }

        let head = [];

        switch (state.headType) {
            case 0:
            case 2:
                head = [
                    'M', ...p1.getCoords(),
                    'L', ...p2.getCoords(),
                    'L', ...p3.getCoords(),
                    'Q', ...p4.getCoords(), ...p5.getCoords(),
                    'L', ...p6.getCoords(),
                    'L', ...p7.getCoords(),
                ];
                break;
            case 1:
                head = [
                    'M', ...p1.getCoords(),
                    'L', ...p3.getCoords(),
                    'Q', ...p4.getCoords(), ...p5.getCoords(),
                    'L', ...p7.getCoords(),
                ];
                break;
        }
        if (state.close && head.length > 0) {
            head.push('Z');
        }

        let circle2 = [];

        if (state.circle2) {
            circle2 = this._drawCircle(zcx, zcy, state.circle2Radius);
        }

        let path = [
            ...closeBulb,
            ...shaft,
            ...head,
            ...circle2,
        ];

        let adorner;

        switch (adornerName) {
            case 'rotate': {
                let center = new Point(zcx, zcy);
                let rayStart = new Point(0.01, 0).rotate(-state.rotate).shift(center);
                let rayEnd = new Point(1, 0).rotate(-state.rotate).mult(state.right).shift(center);
                let arcRadius = state.right * 0.5;
                let arcStart = new Point(arcRadius, 0).rotate(-state.rotate).shift(center);
                let arcEnd = new Point(arcRadius, 0).shift(center);
                adorner = [
                    ...this._drawCircle(zcx, zcy, 0.01),
                    'M', zcx + 0.01, zcy,
                    'L', zcx + state.right, p1m.y,
                    'M', ...rayStart.getCoords(),
                    'L', ...rayEnd.getCoords(),
                    'M', ...arcStart.getCoords(),
                    'A', arcRadius, arcRadius, 0, 0, state.rotate > 0 ? 1 / 192 : 0, ...arcEnd.getCoords(),
                ];
                break;
            }
            case 'cx':
            case 'cy':
                adorner = this._drawCircle(zcx, zcy, 0.01);
                break;
            case 'thickness':
                adorner = this._drawHeight(p0m, p1m, state.thickness, (state.left / 2) / (state.left + state.right));
                break;
            case 'left':
                adorner = [
                    ...this._drawCircle(zcx, zcy, 0.01),
                    'M', zcx - 0.01, p1m.y,
                    'L', zcx - state.left, p1m.y,
                ];
                break;
            case 'right':
                adorner = [
                    ...this._drawCircle(zcx, zcy, 0.01),
                    'M', zcx + 0.01, p1m.y,
                    'L', zcx + state.right, p1m.y,
                ];
                break;
            case 'circle1':
                adorner = this._drawCircle(zcx, zcy, state.circle1Radius);
                break;
            case 'circle2':
                adorner = this._drawCircle(zcx, zcy, state.circle2Radius);
                break;
            case 'bulb':
                if (closeBulb.length > 0) {
                    adorner = closeBulb;
                } else {
                    adorner = [
                        'M', ...p8.getCoords(),
                        ...openBulb,
                        'L', ...p0.getCoords(),
                    ];
                }
                break;
            case 'bulbThickness':
                adorner = this._drawHeight(b0m, p0m, state.bulbThickness);
                break;
            case 'bulbWidth':
                adorner = [
                    ...this._drawCircle(b0m.x, b0m.y, 0.01),
                    'M', b0m.x + 0.01, b0m.y,
                    'L', zcx - state.left + bulbShift, p1m.y,
                ];
                break;
            case 'bulbClose':
                adorner = [
                    'M', ...p0.getCoords(),
                    'L', ...p8.getCoords(),
                ];
                break;
            case 'headType':
                adorner = head;
                break;
            case 'headThickness': {
                let p2md = new Point(p2m.x, p2m.y + state.headTop);
                adorner = [
                    ...this._drawHeight(p2md, p2m, state.headThickness, 1),
                    'M', p1.x, p3.y,
                    'L', ...p1.getCoords(),
                    'M', ...p3.getCoords(),
                    'L', p3.x, p1.y,
                ];
                break;
            }
            case 'headThickness2': {
                let p5md = new Point(p5m.x, p5m.y - state.headBottom + state.thickness / 2);
                adorner = [
                    ...this._drawHeight(p5md, p5m, state.headThickness2),
                    'M', p7.x, p5.y,
                    'L', ...p7.getCoords(),
                    'M', ...p5.getCoords(),
                    'L', p5.x, p7.y,
                ];
                break;
            }
            case 'headTop': {
                let pend = state.headType === 1 ? p3 : p2;
                adorner = [
                    ...this._drawCircle(p2m.x, p1m.y, 0.01),
                    'M', p2m.x, p1m.y - 0.01,
                    'L', p2m.x, pend.y,
                    'L', ...pend.getCoords(),
                ];
                break;
            }
            case 'headTop2':
                adorner = [
                    ...this._drawCircle(p2m.x, p1m.y, 0.01),
                    'M', p2m.x, p1m.y - 0.01,
                    'L', p2m.x, p3.y,
                    'L', ...p3.getCoords(),
                ];
                break;
            case 'headBottom': {
                let pend = state.headType === 1 ? p5 : p6;
                adorner = [
                    ...this._drawCircle(p5m.x, p1m.y, 0.01),
                    'M', p5m.x, p1m.y + 0.01,
                    'L', p5m.x, pend.y,
                    'L', ...pend.getCoords(),
                ];
                break;
            }
            case 'headQuadric': {
                adorner = [
                    'M', ...p3.getCoords(),
                    'L', ...p4.getCoords(),
                    'L', ...p5.getCoords(),
                ];
                break;
            }
            case 'close': {
                adorner = [
                    'M', ...p1.getCoords(),
                    'L', ...p7.getCoords(),
                ];
                break;
            }
        }

        return { path, adorner };
    }

    _drawCircle(cx, cy, r) {
        return [
            'M', cx - r, cy,
            'A', r, r, 0, 0, 0, cx + r, cy,
            'M', cx + r, cy,
            'A', r, r, 0, 0, 0, cx - r, cy,
        ];
    }

    _drawHeight(p0, p1, thickness, scale = 0.5) {
        const line = new Line(p0, p1);
        const dtb = thickness / 2;

        const middle = Point.getMiddle(p0, p1, scale);
        const adp = middle.shift(line.norm.mult(-dtb));
        const adm = middle.shift(line.norm.mult(+dtb));
        const ad0 = adp.shift(line.norm.mult(-0.12));
        const ad1 = adm.shift(line.norm.mult(+0.07));
        const arrow0p0 = line.norm.rotate(+135).mult(0.03).shift(adp);
        const arrow0p1 = line.norm.rotate(-135).mult(0.03).shift(adp);
        const arrow1p0 = line.norm.rotate(+45).mult(0.03).shift(adm);
        const arrow1p1 = line.norm.rotate(-45).mult(0.03).shift(adm);
        return [
            'M', ...ad0.getCoords(),
            'L', ...ad1.getCoords(),
            'M', ...arrow0p0.getCoords(),
            'L', ...adp.getCoords(),
            'L', ...arrow0p1.getCoords(),
            'M', ...arrow1p0.getCoords(),
            'L', ...adm.getCoords(),
            'L', ...arrow1p1.getCoords(),
        ];
    }

    // Samson Post
    _getSupportPath(state, adornerName) {
        /*
         *                    pcp
         *                pc(zcx,zcy)
         *                     ..
         *                    .cm.
         *                   .    .
         *                  .      .
         *                 .        .
         *                .          .
         *         pc1p p1p          p3p pc3p
         *              p1 pc1m  pc3m p3
         *             /1m\          /3m\
         *            /    \        /    \
         *           / l1m l1 1p2p l2 l2m\
         *          /        \    /        \
         *    l0p l0 l0m      \2p/     l3m l3 l3p
         *        /            p2            \
         *       /             2m             \
         *      /                              \
         * p0p p0 p0m                       p4p p4 p4m
         *
         */
        let zcx = state.cx;
        let zcy = state.cy;
        let wb = state.bottomWidth / 2;
        let wt = state.topWidth / 2;
        let ht = state.topHeight;
        let dtt = state.topThickness / 2;
        let dtb = state.bottomThickness / 2;
        let bottom = 1 - state.bottomSpacing;
        let top = zcy;

        let pc = new Point(zcx, zcy);
        let p0 = new Point(zcx - wb, bottom);
        let p1 = new Point(zcx - wt, top);
        let p2 = new Point(zcx, top + ht);
        let p3 = new Point(zcx + wt, top);
        let p4 = new Point(zcx + wb, bottom);

        if (state.extended) {
            p1 = Point.getMiddle(p0, pc, state.extendedLength);
            p2 = new Point(p2.x, p2.y + (p1.y - pc.y));
            p3 = Point.getMiddle(p4, pc, state.extendedLength);
        }

        let l0 = new Line(p0, p1);
        let l1 = new Line(p1, p2);
        let l2 = new Line(p2, p3);
        let l3 = new Line(p3, p4);

        let lb = Line.horizontal(bottom);

        let l0p = l0.shift(dtb);
        let l1p = l1.shift(dtt);
        let l2p = l2.shift(dtt);
        let l3p = l3.shift(dtb);

        let p0p = l0p.intersect(lb);
        let p1p = l0p.intersect(l1p);
        let p2p = l1p.intersect(l2p);
        let p3p = l2p.intersect(l3p);
        let p4p = l3p.intersect(lb);
        let pcp = l0p.intersect(l3p);
        let pc1p = p1p;
        let pc3p = p3p;

        let l0m = l0.shift(-dtb);
        let l1m = l1.shift(-dtt);
        let l2m = l2.shift(-dtt);
        let l3m = l3.shift(-dtb);

        let p0m = l0m.intersect(lb);
        let p1m = l0m.intersect(l1m);
        let p2m = l1m.intersect(l2m);
        let p3m = l2m.intersect(l3m);
        let p4m = l3m.intersect(lb);
        let pcm = l0m.intersect(l3m);
        let pc1m = l1p.intersect(l0m);
        let pc3m = l2p.intersect(l3m);

        let modeP, modeM, adorner;

        if (state.mode === 0) {
            modeP = [
                'L', ...p2p.getCoords(),
                'L', ...p3p.getCoords(),
            ];
            modeM = [
                'L', ...p2m.getCoords(),
                'L', ...p1m.getCoords(),
            ];
        } else {
            let qc = new Point(zcx + state.quadricCx, zcy + state.quadricCy);
            let radiusP = state.quadricR;
            let radiusM = radiusP + state.topThickness;

            let l0pi = l0p.intersect(new Circle(qc.x, qc.y, radiusP));
            let l3pi = l3p.intersect(new Circle(qc.x, qc.y, radiusP));

            if (l0pi.length > 0 && l3pi.length > 0) {
                p1p = l0pi.sort((a, b) => b.y - a.y)[0];
                p3p = l3pi.sort((a, b) => b.y - a.y)[0];

                modeP = [
                    'A', radiusP, radiusP, 0, 0, 0,
                    ...p3p.getCoords(),
                ];
            } else {
                modeP = [
                    'L', ...p2p.getCoords(),
                    'L', ...p3p.getCoords(),
                ];
            }

            let l0mi = l0m.intersect(new Circle(qc.x, qc.y, radiusM));
            let l3mi = l3m.intersect(new Circle(qc.x, qc.y, radiusM));

            if (l0mi.length > 0 && l3mi.length > 0) {

                p1m = l0mi.sort((a, b) => b.y - a.y)[0];
                p3m = l3mi.sort((a, b) => b.y - a.y)[0];

                modeM = [
                    'A', radiusM, radiusM, 0, 0, 1 / 192,
                    ...p1m.getCoords(),
                ];
            } else {
                modeM = [
                    'L', ...p2m.getCoords(),
                    'L', ...p1m.getCoords(),
                ];
            }

            if (adornerName === 'quadric') {
                let c00 = this._drawCircle(p1p.x, p1p.y, 0.01);
                let c01 = this._drawCircle(p3p.x, p3p.y, 0.01);

                let c30 = this._drawCircle(p1m.x, p1m.y, 0.01);
                let c31 = this._drawCircle(p3m.x, p3m.y, 0.01);

                adorner = [
                    ...this._drawCircle(qc.x, qc.y, radiusP),
                    ...this._drawCircle(qc.x, qc.y, radiusM),
                    ...c00,
                    ...c01,
                    ...c30,
                    ...c31,
                ];
            }
        }

        let extendedModePath = ['L', ...pcp.getCoords()];

        if (state.extended && state.extendedMode === 1) {
            let outerCircle = new Circle(pc.x, pc.y, state.extendedCircle1Radius);
            let i0 = l0p.intersect(outerCircle).sort((a, b) => b.y - a.y)[0];
            let i1 = l3p.intersect(outerCircle).sort((a, b) => b.y - a.y)[0];
            extendedModePath = [
                'L', ...i0.getCoords(),
                'A', state.extendedCircle1Radius, state.extendedCircle1Radius, 0, 1 / 192, 1 / 192, ...i1.getCoords(),
            ];
        }

        let extendedPath = [];
        if (state.extended) {
            extendedPath = [
                'M', ...pc1m.getCoords(),
                'L', ...pc1p.getCoords(),
                ...extendedModePath,
                'L', ...pc3p.getCoords(),
                'L', ...pc3m.getCoords(),
                'L', ...pcm.getCoords(),
                'Z',
            ]
        }

        const path = [
            ...extendedPath,
            'M', ...p0p.getCoords(),
            'L', ...p1p.getCoords(),
            ...modeP,
            'L', ...p4p.getCoords(),
            'L', ...p4m.getCoords(),
            'L', ...p3m.getCoords(),
            ...modeM,
            'L', ...p0m.getCoords(),
            'Z',
        ];

        switch (adornerName) {
            case 'cx':
            case 'cy':
                adorner = this._drawCircle(zcx, zcy, 0.01);
                break;
            case 'topThickness':
                adorner = this._drawHeight(p1, p2, state.topThickness);
                break;
            case 'topWidth':
                adorner = [
                    'M', ...p1.getCoords(),
                    'L', p1.x, p1.y - 0.05,
                    'L', p3.x, p3.y - 0.05,
                    'L', ...p3.getCoords(),
                ];
                break;
            case 'topHeight':
                adorner = [
                    ...this._drawCircle(p2.x, p2.y - state.topHeight, 0.01),
                    'M', p2.x, p2.y - state.topHeight + 0.01,
                    'L', p2.x, p2.y,
                ];
                break;
            case 'bottomThickness':
                adorner = this._drawHeight(p0, p1, state.bottomThickness, 0.3);
                break;
            case 'bottomWidth':
                adorner = [
                    'M', ...p0.getCoords(),
                    'L', p0.x, p0.y + state.bottomSpacing / 2,
                    'L', p4.x, p4.y + state.bottomSpacing / 2,
                    'L', ...p4.getCoords(),
                ];
                break;
            case 'bottomSpacing':
                adorner = [
                    'M', ...p0.getCoords(),
                    'L', p0.x, 1,
                    'M', ...p4.getCoords(),
                    'L', p4.x, 1,
                ];
                break;
            case 'extended':
            case 'extendedLength':
                adorner = [
                    ...this._drawCircle(p0.x, p0.y, 0.01),
                    'M', ...Point.getVector(p0, p1).normalize().mult(0.01).shift(p0).getCoords(),
                    'L', ...p1.getCoords(),
                ]
                break;
        }

        return {path, adorner};
    }
}

Content.defaultProps = {
    size: 320,
    hammer: {
        rotate: 0,
        cx: 0.5,
        cy: 0.5,
        thickness: 0.06,
        left: 0.45,
        right: 0.45,
        headThickness: 0.04,
        headTop: 0.2,
        headBottom: 0.2,
        headQdx: 0.5,
        headQdy: 0.5,
        headType: 0,
    },
    support: {
        cx: 0.5,
        cy: 0.5,
        topThickness: 0.06,
        topWidth: 0.2,
        topHeight: 0.1,
        bottomThickness: 0.06,
        bottomWidth: 0.5,
        bottomSpacing: 0.02,
        quadricCx: 0.5,
        quadricCy: 0.5,
        mode: 0,
    },
};

export default Content;