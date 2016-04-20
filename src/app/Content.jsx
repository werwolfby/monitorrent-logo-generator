import React from 'react';
import Paper from 'material-ui/lib/paper';

class Content extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        let rotate = `rotate(${this.props.rotate} ${this.props.cx * 192} ${this.props.cy * 192})`;
        let zcx = this.props.cx;
        let zcy = this.props.cy;
        let headLength = this.props.headTop + this.props.headBottom;

        let qx = zcx + this.props.right + this.props.headThickness + this.props.headQdx * headLength;
        let qy = zcy - this.props.headTop + this.props.headQdy * headLength;

        let path = [
            'M', zcx - this.props.left, zcy - this.props.thickness / 2,
            'L', zcx + this.props.right, zcy - this.props.thickness / 2,
            ...(this.props.headType === 0 ? ['L', zcx + this.props.right, zcy - this.props.headTop] : []),
            'L', zcx + this.props.right + this.props.headThickness, zcy - this.props.headTop,
            'Q', qx, qy, zcx + this.props.right + this.props.headThickness, zcy + this.props.headBottom,
            ...(this.props.headType === 0 ? ['L', zcx + this.props.right, zcy + this.props.headBottom]: []),
            'L', zcx + this.props.right, zcy + this.props.thickness / 2,
            'L', zcx - this.props.left, zcy + this.props.thickness / 2,
            'Z',
        ];
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
                    <path d={path} transform={rotate} stroke="black"/>
                </svg>
            </Paper>
        );
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
    size: 320,
    headType: 0,
};

export default Content;