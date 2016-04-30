import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import Slider from 'material-ui/lib/slider';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import themeDecorator from 'material-ui/lib/styles/theme-decorator';
import Content from './Content';
import Settings from './Settings';

const muiTheme = getMuiTheme({
    accent1Color: Colors.blueGrey500,
});

class Main extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleOnHammerChange = this.handleOnHammerChange.bind(this);
        this.handleOnSupportChange = this.handleOnSupportChange.bind(this);
        this.handleOnSupportAdornerChange = this.handleOnSupportAdornerChange.bind(this);
        this.handleOnHammerAdornerChange = this.handleOnHammerAdornerChange.bind(this);

        this.hammerProperties = {
            'Shaft': {
                'rotate': { title: 'Rotate', min: -180, max: 180, step: 1 },
                'cx': 'Center X',
                'cy': 'Center Y',
                'thickness': { title: 'Thickness', min: 0.01, max: 0.2, step: 0.001 },
                'left': 'Left',
                'right': 'Right',
                'circle1': { title: 'Outer Circle', value: true },
                'circle1Radius': { title: 'Radius', min: s => s.thickness / 2 + 0.001, max: s => s.thickness * 2, step: 0.001, validFor: { 'circle1': [true] }, adorner: 'circle1' },
                'circle2': { title: 'Inner Hole', value: true },
                'circle2Radius': { title: 'Radius', min: 0.01, max: s => (s.circle1 ? s.circle1Radius : s.thickness / 2) - 0.001, step: 0.001, validFor: { 'circle2': [true] }, adorner: 'circle2' },
            },
            'Head': {
                'headType': { title: 'Type', values: [{ title: 'Head 0', value: 0 }, { title: 'Head 1', value: 1 }, { title: 'Head 2', value: 2 }] },
                'headThickness': { title: 'Thickness', min: 0.01, max: 0.2, step: 0.001 },
                'headThickness2': { title: 'Thickness 2', min: 0.01, max: 0.2, step: 0.001, validFor: { 'headType': [2] } },
                'headTop': { title: 'Top', max: 0.5, step: 0.01 },
                'headTop2': { title: 'Top 2', max: 0.5, step: 0.01, validFor: { 'headType': [2] } },
                'headBottom': 'Bottom',
                'headQdx': { title: 'Q dx', adorner: 'headQuadric' },
                'headQdy': { title: 'Q dy', adorner: 'headQuadric' },
                'close': { title: 'Close', value: true },
            },
            'Bulb': {
                'bulb': { title: 'Bulb', value: true },
                'bulbThickness': { title: 'Thickness', min: 0.01, max: 0.2, step: 0.001, validFor: { 'bulb': [true] } },
                'bulbWidth': { title: 'Width', min: 0.01, max: s => s.left, validFor: { 'bulb': [true] } },
                'bulbClose': { title: 'Close', value: true },
            },
        };
        this.supportProperties = {
            'Main': {
                'cx': 'Center X',
                'cy': 'Center Y',
                'bottomThickness': { title: 'Bottom Thickness', min: 0.01, max: 0.2, step: 0.001 },
                'bottomWidth': 'Bottom Width',
                'bottomSpacing': { title: 'Bottom Spacing', min: 0.01, max: 0.2, step: 0.001 },
                'topThickness': { title: 'Top Thickness', min: 0.01, max: 0.2, step: 0.001 },
                'topWidth': { title: 'Top Width', validFor: { 'extended': [false] } },
                'topHeight': { title: 'Top Height', validFor: { 'mode': [0] } },
                'mode': { title: 'Mode', values: [{ title: 'Lines', value: 0 }, { title: 'Quadric', value: 1 }] },
                'quadricCx': { title: 'Quadric Center dX', min: -0.5, max: 0.5, step: 0.001, validFor: { 'mode': [1] }, adorner: 'quadric' },
                'quadricCy': { title: 'Quadric Center dY', min: -0.5, max: 0.5, step: 0.001, validFor: { 'mode': [1] }, adorner: 'quadric' },
                'quadricR': { title: 'Quadric Radius', min: 0, max: 0.5, step: 0.001, validFor: { 'mode': [1] }, adorner: 'quadric' },
                'extended': { title: 'Extended', value: true },
                'extendedLength': { title: 'Length', min: 0.1, max: 0.9, step: 0.001, validFor: { 'extended': [true] } },
                'extendedMode': { title: 'Mode', values: [{ title: 'Angle Ending', value: 0 }, { title: 'Round', value: 1 }], validFor: { 'extended': [true] } },
                'extendedCircle1Radius': { title: 'Radius', min: s => 0.001, max: 0.4, step: 0.001, validFor: { 'extended': [true], 'extendedMode': [1] } },
                'extendedCircle2': { title: 'Inner Hole', value: true, validFor: { 'extended': [true], 'extendedMode': [1] } },
                'extendedCircle2Radius': { title: 'Radius', min: 0.01, max: s => s.extendedCircle1Radius - 0.001, step: 0.001, validFor: { 'extended': [true], 'extendedCircle2': [true], 'extendedMode': [1] } },
            },
        }

        let defaultHammer = {
            rotate: -22,
            cx: 0.47,
            cy: 0.4,
            thickness: 0.06,
            left: 0.45,
            right: 0.35,
            circle1: true,
            circle1Radius: 0.07,
            circle2: true,
            circle2Radius: 0.02,
            bulb: false,
            bulbThickness: 0.06,
            bulbWidth: 0.07,
            headType: 0,
            headThickness: 0.05,
            headThickness2: 0.03,
            headTop: 0.16,
            headTop2: 0.16,
            headBottom: 0.22,
            headQdx: 0.32,
            headQdy: 0.18,
            close: false,
        };

        let defaultSupport = {
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
            quadricR: 0.2,
            mode: 0,
            extended: false,
            extendedLength: 0.4,
            extendedMode: 0,
            extendedCircle1Radius: 0.1,
            extendedCircle2: true,
            extendedCircle2Radius: 0.02,
        };

        let hashState = { hammer: {}, support: {} };
        if (window.location.hash) {
            hashState = JSON.parse(window.location.hash.substr(1));
        }

        this.state = {
            muiTheme: context.muiTheme || getMuiTheme(),
            hammer: Object.assign({}, defaultHammer, hashState.hammer || {}),
            support: Object.assign({}, defaultSupport, hashState.support || {}),
            adorner: null,
        };
    }

    handleOnHammerChange(value) {
        this.setState({ hammer: value }, this._updateHash);
    }

    handleOnSupportChange(value) {
        this.setState({ support: value }, this._updateHash);
    }

    handleOnSupportAdornerChange(adorner) {
        this.setState({ supportAdorner: adorner });
    }

    handleOnHammerAdornerChange(adorner) {
        this.setState({ hammerAdorner: adorner });
    }

    _updateHash() {
        let settings = {
            hammer: this.state.hammer,
            support: this.state.support,
        }
        window.location.hash = JSON.stringify(settings);
    }

    render() {
        return (
            <div className="container">
                <AppBar className="app-bar" title="MoniTorrent Logo Generator" iconElementLeft={<div></div>}/>
                <div className="container-content">
                    <div className="content">
                        <Content hammer={this.state.hammer} support={this.state.support} supportAdorner={this.state.supportAdorner} hammerAdorner={this.state.hammerAdorner}/>
                    </div>
                    <Paper rounded={false} className="settings" style={{ overflow: 'auto' }} zDepth={3}>
                        <Tabs>
                            <Tab label="M">
                                <Settings properties={this.supportProperties} values={this.state.support} onValuesChange={this.handleOnSupportChange} onAdornerChange={this.handleOnSupportAdornerChange}/>
                            </Tab>
                            <Tab label="T">
                                <Settings properties={this.hammerProperties} values={this.state.hammer} onValuesChange={this.handleOnHammerChange} onAdornerChange={this.handleOnHammerAdornerChange}/>
                            </Tab>
                        </Tabs>
                    </Paper>
                </div>
            </div>
        );
    }
}

Main.childContextTypes = {
    muiTheme: React.PropTypes.object,
};

export default themeDecorator(muiTheme)(Main);
