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
    let properties = {
      'rotate': {title: 'Rotate', min: -180, max: 180, step: 1},
      'cx': 'Center X',
      'cy': 'Center Y',
      'thickness': {title: 'Thickness', min: 0.01, max: 0.2, step: 0.001},
      'left': 'Left',
      'right': 'Right',
      'headThickness': {title: 'Head Thickness', min: 0.01, max: 0.2, step: 0.001},
      'headTop': 'Head Top',
      'headBottom': 'Head Bottom',
      'headQdx': 'Head Q dx',
      'headQdy': 'Head Q dy',
    };
    this.sliders = Object.keys(properties).map(k => {
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
    };
  }

  handleOnChange(value, name) {
    this.setState(Object.assign({}, this.state, {[name]: value}));
  }

  render() {
    let sliders = this.sliders.map(s => {
      let value = this.state[s.prop];

      return (
        <div key={s.prop}>
          <div className="value">{s.title} ({value})</div>
          <Slider className="slider" name="rotate" min={s.min} max={s.max} step={s.step} value={value} onChange={s.handler}/>
        </div>
        );
      });

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

export default themeDecorator(muiTheme)(Main);
