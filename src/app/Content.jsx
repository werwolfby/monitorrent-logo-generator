import React from 'react';
import Paper from 'material-ui/lib/paper';

class Content extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        let rotate = `rotate(${this.props.hammer.rotate} ${this.props.hammer.cx * 192} ${this.props.hammer.cy * 192})`;
        let path = this._getHammerPath(this.props.hammer);
        for (let i = 0; i < path.length; i++) {
            if (typeof path[i] === 'number') {
                path[i] = path[i] * 192;
            }
        }
        path = path.join(' ');

        return (
            <Paper style={{width: this.props.size, height: this.props.size}}>
                <svg xmlns="http://www.w3.org/svg/2000"
                    viewBox={"0 0 192 192"} width={this.props.size} height={this.props.size}>
                    <path d={path} transform={rotate} stroke="black" fill="none"/>
                </svg>
            </Paper>
        );
    }

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
}

Content.propTypes = {
    rotate: React.PropTypes.number,
    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    thickness: React.PropTypes.number,
    left: React.PropTypes.number,
    right: React.PropTypes.number,
    headThickness: React.PropTypes.number,
    headTop: React.PropTypes.number,
    headBottom: React.PropTypes.number,
    headQdx: React.PropTypes.number,
    headQdy: React.PropTypes.number,
    headType: React.PropTypes.number,
    size: React.PropTypes.number,
};
Content.defaultProps = {
    size: 320,
    hammer: {
        rotate: 0,
        cx: 0.5,
        cy: 0.5,
        thickness: 0.02,
        left: 0.45,
        right: 0.45,
        headThickness: 0.04,
        headTop: 0.2,
        headBottom: 0.2,
        headQdx: 0.5,
        headQdy: 0.5,
        headType: 0,
    },
};

export default Content;