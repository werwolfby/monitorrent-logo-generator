import React from 'react';
import Paper from 'material-ui/lib/paper';

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
        function getDeltaHeight(w, dw, h) {
            return (h * (w + dw)/w) - h;
        }

        let zcx = state.cx;
        let zcy = state.cy;
        let w = state.bottomWidth / 2;
        let dw = state.thickness / 2;
        let h = 1 - zcy - state.bottomSpacing;
        let sw = state.topWidth / 2;
        let bigDh = getDeltaHeight(w - sw, dw, h);

        return [
            'M', zcx - w - dw, 1 - state.bottomSpacing,
            'L', zcx - sw, zcy - bigDh,
            'L', zcx, zcy - bigDh + sw,
            'L', zcx + sw, zcy - bigDh,
            'L', zcx + w + dw, 1 - state.bottomSpacing,
            'L', zcx + w - dw, 1 - state.bottomSpacing,
            'L', zcx + sw, zcy + bigDh,
            'L', zcx, zcy + bigDh + sw,
            'L', zcx - sw, zcy + bigDh,
            'L', zcx - w + dw, 1 - state.bottomSpacing,
            'Z',
        ]
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