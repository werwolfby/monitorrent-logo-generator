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
import { Row, Col } from 'react-flexbox-grid/lib/index';


const muiTheme = getMuiTheme({
  accent1Color: Colors.blueGrey500,
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnChange = this.handleOnChange.bind(this);

    this.state = {
      value1: 0.3,
    };
  }

  handleOnChange(evt, value) {
    console.log(evt);
    this.setState(Object.assign({}, this.state, {value1: value}));
  }

  render() {
    return (
      <div className="container">
        <AppBar className="app-bar"
          title="MoniTorrent Logo Generator"
          iconElementLeft={<div></div>}
        />
        <div className="container-content">
          <Paper rounded={false} className="content" zDepth={1}>
            <h1>Content</h1>
          </Paper>
          <Paper rounded={false} className="settings" zDepth={3}>
            <div>Value 1</div>
            <Slider value={this.state.value1} onChange={this.handleOnChange}/>
          </Paper>
        </div>
      </div>
    );
  }
}

export default themeDecorator(muiTheme)(Main);
