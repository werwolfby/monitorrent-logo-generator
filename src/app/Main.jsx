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
import Settings from './Settings';

const muiTheme = getMuiTheme({
  accent1Color: Colors.blueGrey500,
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnHammerChange = this.handleOnHammerChange.bind(this);

    this.hammerProperties = {
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

    this.state = {
      hammer: {
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
      },
    };
  }

  handleOnHammerChange(value) {
    this.setState({hammer: value});
  }

  render() {
    return (
      <div className="container">
        <AppBar className="app-bar"
          title="MoniTorrent Logo Generator"
          iconElementLeft={<div></div>}
        />
        <div className="container-content">
          <div className="content">
            <Content {...this.state.hammer} headType={0}/>
          </div>
          <Paper rounded={false} className="settings" style={{overflow: 'auto'}} zDepth={3}>
            <Settings properties={this.hammerProperties} values={this.state.hammer} onChange={this.handleOnHammerChange}/>
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
