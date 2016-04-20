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

    this.state = {
      rotate: 0,
    };
  }

  handleOnChange(evt, value) {
    this.setState(Object.assign({}, this.state, {rotate: value}));
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
            <Content rotate={this.state.rotate}/>
          </div>
          <Paper rounded={false} className="settings" zDepth={3}>
            <div className="value">Rotate ({this.state.rotate})</div>
            <Slider className="slider" min={0} max={360} step={1} value={this.state.rotate} onChange={this.handleOnChange}/>
          </Paper>
        </div>
      </div>
    );
  }
}

export default themeDecorator(muiTheme)(Main);
