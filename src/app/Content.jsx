import React from 'react';
import Paper from 'material-ui/lib/paper';
import { Point, Line } from "./Geometry";

class Content extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        let rotate = `rotate(${this.props.hammer.rotate} ${this.props.hammer.cx * 192} ${this.props.hammer.cy * 192})`;

        let hammerPath = this._getHammerPath(this.props.hammer);
        this._scale(hammerPath);
        hammerPath = hammerPath.join(' ');

        let supportPath = this._getSupportPath(this.props.support);
        this._scale(supportPath);
        supportPath = supportPath.join(' ');

        return (
            <Paper style={{width: this.props.size, height: this.props.size}}>
                <svg xmlns="http://www.w3.org/svg/2000"
                    viewBox={"0 0 192 192"} width={this.props.size} height={this.props.size}>
                    <path d={hammerPath} transform={rotate} stroke="black" fill="none"/>
                    <path d={supportPath} stroke="black" fill="none"/>
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
        let zcx = state.cx;
        let zcy = state.cy;
        let headLength = state.headTop + state.headBottom;

        let qx = zcx + state.right + state.headThickness + state.headQdx * headLength;
        let qy = zcy - state.headTop + state.headQdy * headLength;

        return [
            'M', zcx - state.left, zcy - state.thickness / 2,
            'L', zcx + state.right, zcy - state.thickness / 2,
            ...(state.headType === 0 ? ['L', zcx + state.right, zcy - state.headTop] : []),
            'L', zcx + state.right + state.headThickness, zcy - state.headTop,
            'Q', qx, qy, zcx + state.right + state.headThickness, zcy + state.headBottom,
            ...(state.headType === 0 ? ['L', zcx + state.right, zcy + state.headBottom]: []),
            'L', zcx + state.right, zcy + state.thickness / 2,
            'L', zcx - state.left, zcy + state.thickness / 2,
            'Z',
        ];
    }

    // Samson Post
    _getSupportPath(state) {
        let zcx = state.cx;
        let zcy = state.cy;
        let wb = state.bottomWidth / 2;
        let wt = state.topWidth / 2;
        let dt = state.thickness / 2;
        let bottom = 1 - state.bottomSpacing;
        let top = zcy;

        let p0 = new Point(zcx - wb, bottom);
        let p1 = new Point(zcx - wt, top);
        let p2 = new Point(zcx, top + wt);
        let p3 = new Point(zcx + wt, top);
        let p4 = new Point(zcx + wb, bottom);

        let l0 = new Line(p0, p1);
        let l1 = new Line(p1, p2);
        let l2 = new Line(p2, p3);
        let l3 = new Line(p3, p4);

        let lb = Line.horizontal(bottom);

        let l0p = l0.shift(dt);
        let l1p = l1.shift(dt);
        let l2p = l2.shift(dt);
        let l3p = l3.shift(dt);

        let p0p = l0p.intersect(lb);
        let p1p = l0p.intersect(l1p);
        let p2p = l1p.intersect(l2p);
        let p3p = l2p.intersect(l3p);
        let p4p = l3p.intersect(lb);

        let l0m = l0.shift(-dt);
        let l1m = l1.shift(-dt);
        let l2m = l2.shift(-dt);
        let l3m = l3.shift(-dt);

        let p0m = l0m.intersect(lb);
        let p1m = l0m.intersect(l1m);
        let p2m = l1m.intersect(l2m);
        let p3m = l2m.intersect(l3m);
        let p4m = l3m.intersect(lb);

        return [
            'M', ...p0p.getCoords(),
            'L', ...p1p.getCoords(),
            'L', ...p2p.getCoords(),
            'L', ...p3p.getCoords(),
            'L', ...p4p.getCoords(),
            'L', ...p4m.getCoords(),
            'L', ...p3m.getCoords(),
            'L', ...p2m.getCoords(),
            'L', ...p1m.getCoords(),
            'L', ...p0m.getCoords(),
            'Z',
        ];
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
        thickness: 0.06,
        topWidth: 0.2,
        bottomWidth: 0.5,
        bottomSpacing: 0.02,
    },
};

export default Content;