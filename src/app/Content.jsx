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

        let hammerPath = this._getHammerPath(this.props.hammer, this.props.hammerAdorner);
        this._scale(hammerPath);
        hammerPath = hammerPath.join(' ');

        let supportPath = this._getSupportPath(this.props.support, this.props.supportAdorner);
        this._scale(supportPath[0]);
        this._scale(supportPath[1]);
        let supportPath0 = supportPath[0].join(' ');
        let supportPath1 = supportPath[1].join(' ');

        return (
            <Paper style={{width: this.props.size, height: this.props.size}}>
                <svg xmlns="http://www.w3.org/svg/2000"
                    viewBox={"0 0 192 192"} width={this.props.size} height={this.props.size}>
                    <path d={hammerPath} transform={rotate} stroke="black" fill="white"/>
                    <path d={supportPath0} stroke="black" fill="white"/>
                    <path d={supportPath1} stroke="red" fill="none"/>
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
    _getHammerPath(state) {
        /*             p2--p3
         *              |    \
         * p0 -------- p1    |
         * |            |    p4
         * p8 -------- p7    |
         *              |    /
         *             p6--p5
         * */
        let zcx = state.cx;
        let zcy = state.cy;
        let top2 = state.headType === 2 ? state.headTop2 : state.headTop;
        let headLength = top2 + state.headBottom;

        let thickness1 = state.headThickness;
        let thickness2 = state.headType === 2 ? state.headThickness2 : thickness1;

        let p0 = new Point(zcx - state.left, zcy - state.thickness / 2);
        let p1 = new Point(zcx + state.right, zcy - state.thickness / 2);
        let p2 = new Point(zcx + state.right, zcy - state.headTop);
        let p3 = new Point(zcx + state.right + thickness1, zcy - top2);
        let p4 = new Point(zcx + state.right + thickness1 + state.headQdx * headLength,
                           zcy - top2 + state.headQdy * headLength);
        let p5 = new Point(zcx + state.right + thickness2, zcy + state.headBottom);
        let p6 = new Point(zcx + state.right, zcy + state.headBottom);
        let p7 = new Point(zcx + state.right, zcy + state.thickness / 2);
        let p8 = new Point(zcx - state.left, zcy + state.thickness / 2);

        let shaft = [
            'M', ...p7.getCoords(),
            'L', ...p8.getCoords(),
            'L', ...p0.getCoords(),
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

        return [
            ...shaft,
            ...head,
        ];
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
        let zcx = state.cx;
        let zcy = state.cy;
        let wb = state.bottomWidth / 2;
        let wt = state.topWidth / 2;
        let ht = state.topHeight;
        let dtt = state.topThickness / 2;
        let dtb = state.bottomThickness / 2;
        let bottom = 1 - state.bottomSpacing;
        let top = zcy;

        let p0 = new Point(zcx - wb, bottom);
        let p1 = new Point(zcx - wt, top);
        let p2 = new Point(zcx, top + ht);
        let p3 = new Point(zcx + wt, top);
        let p4 = new Point(zcx + wb, bottom);

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

        let l0m = l0.shift(-dtb);
        let l1m = l1.shift(-dtt);
        let l2m = l2.shift(-dtt);
        let l3m = l3.shift(-dtb);

        let p0m = l0m.intersect(lb);
        let p1m = l0m.intersect(l1m);
        let p2m = l1m.intersect(l2m);
        let p3m = l2m.intersect(l3m);
        let p4m = l3m.intersect(lb);

        let modeP, modeM, adorner = [];

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

        const path = [
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
                    ...this._drawCircle(zcx, zcy, 0.01),
                    'M', zcx, zcy + 0.01,
                    'L', zcx, zcy + ht,
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
        }

        return [path, adorner];
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