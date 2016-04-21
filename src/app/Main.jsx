import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import Slider from 'material-ui/lib/slider';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import themeDecorator from 'material-ui/lib/styles/theme-decorator';
import Content from './Content';

const muiTheme = getMuiTheme({
  accent1Color: Colors.blueGrey500,
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnChange = this.handleOnChange.bind(this);
    this._mapSlider = this._mapSlider.bind(this);
    this._subHeader = this._subHeader.bind(this);

    let properties = {
      'Shaft': {
          'rotate': {title: 'Rotate', min: -180, max: 180, step: 1},
          'cx': 'Center X',
          'cy': 'Center Y',
          'thickness': {title: 'Thickness', min: 0.01, max: 0.2, step: 0.001},
          'left': 'Left',
          'right': 'Right',
        },
      'Head': {
        'headThickness': {title: 'Thickness', min: 0.01, max: 0.2, step: 0.001},
        'headTop': 'Top',
        'headBottom': 'Bottom',
        'headQdx': 'Q dx',
        'headQdy': 'Q dy',
      },
    };
    let createHandlers = (properties) => {
      return Object.keys(properties).map(k => {
        let value = properties[k];
        let title = value;
        let min = 0;
        let max = 1;
        let step = 0.01;

        if (typeof value === 'object') {
          title = value.title;
          min = value.min;
          max = value.max;
          step = value.step;
        }

        return {
          title: title,
          min: min,
          max: max,
          step: step,
          prop: k,
          handler: (evt, value) => this.handleOnChange(value, k),
        };
      });
    };
    this.sliders = Object.keys(properties).map(h => ({subheader: h, properties: createHandlers(properties[h])}));

    this.state = {
      rotate: -22,
      cx: 0.47,
      cy: 0.4,
      thickness: 0.06,
      left: 0.45,
      right: 0.35,
      headThickness: 0.05,
      headTop: 0.16,
      headBottom: 0.22,
      headQdx: 0.32,
      headQdy: 0.18,
      muiTheme: context.muiTheme || getMuiTheme(),
    };
  }

  getChildContext() {
    return {
      muiTheme: muiTheme,
    };
  }

  handleOnChange(value, name) {
    this.setState(Object.assign({}, this.state, {[name]: value}));
  }

  _mapSlider(s) {
    let value = this.state[s.prop];

    return (
      <div key={s.prop}>
        <div className="value">{s.title} ({value})</div>
        <Slider className="slider" name="rotate" style={{marginTop: 7, marginBottom: 7}} min={s.min} max={s.max} step={s.step} value={value} onChange={s.handler}/>
      </div>
      );
  }

  _subHeader(name) {
    const muiTheme = this.state.muiTheme;
    let themeVariables = muiTheme.appBar;

    return (<div className="value" key={name} style={{backgroundColor: themeVariables.color, color: themeVariables.textColor, padding: 5}}>{name}</div>);
  }

  render() {
    let sliders;
    if (this.sliders.length > 1)
    {
      let mappedSliders = this.sliders.map(s => [this._subHeader(s.subheader), ...s.properties.map(this._mapSlider)]);
      sliders = mappedSliders.reduce((p, s) => [...p, ...s], []);
    }
    else
    {
      sliders = this.sliders[0].properties.map(this._mapSlider);
    }

    return (
      <div className="container">
        <AppBar className="app-bar"
          title="MoniTorrent Logo Generator"
          iconElementLeft={<div></div>}
        />
        <div className="container-content">
          <div className="content">
            <Content {...this.state} headType={0}/>
          </div>
          <Paper rounded={false} className="settings" style={{overflow: 'auto'}} zDepth={3}>
            {sliders}
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
