import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import Colors from 'material-ui/lib/styles/colors';
import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import Slider from 'material-ui/lib/slider';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleOnChange = this.handleOnChange.bind(this);
    this._mapSlider = this._mapSlider.bind(this);
    this._subHeader = this._subHeader.bind(this);
    this._onChange = props.onChange;

    const properties = props.properties;
    const createHandlers = (properties) => {
      return Object.keys(properties).map(k => {
        let ext = null;
        let value = properties[k];

        if (typeof value === 'object') {
          if (Array.isArray(value.values)) {
            ext = {
              title: value.title,
              values: value.values,
            };
          }
          else {
            ext = {
              title: value.title,
              min: value.min,
              max: value.max,
              step: value.step,
            };
          }
        } else {
          ext = {
            title: value,
            min: 0,
            max: 1,
            step: 0.01,
          };
        }

        return Object.assign({
            prop: k,
            handler: (evt, value) => this.handleOnChange(value, k),
          }, ext);
      });
    };
    this.sliders = Object.keys(properties).map(h => ({subheader: h, properties: createHandlers(properties[h])}));

    this.state = Object.assign({}, {values: props.values}, {muiTheme: context.muiTheme || getMuiTheme()});
  }

  handleOnChange(value, name) {
    let values = Object.assign({}, this.state.values, {[name]: value});
    this.setState({values}, () => this._onChange(this.state.values));
  }

  _mapSlider(s) {
    let value = this.state.values[s.prop];
    let control = null;
    if (s.values) {
      let values = s.values.map(v => <MenuItem key={v.value} value={v.value} primaryText={v.title}/>)

      return (
        <div key={s.prop} style={{margin: 7}}>
          <SelectField fullWidth={true} value={value} onChange={s.handler}>
            {values}
          </SelectField>
        </div>
      );
    } else {
      return (
        <div key={s.prop}>
          <div className="value">{s.title} ({value})</div>
          <Slider className="slider" name="rotate" style={{marginTop: 7, marginBottom: 7}} min={s.min} max={s.max} step={s.step} value={value} onChange={s.handler}/>
        </div>
      );
    }
  }

  _subHeader(name) {
    const muiTheme = this.state.muiTheme;
    let themeVariables = muiTheme.appBar;

    return (<div className="value" key={name} style={{backgroundColor: themeVariables.color, color: themeVariables.textColor, padding: 5}}>{name}</div>);
  }

  render() {
    let sliders;
    if (this.sliders.length > 1) {
      let mappedSliders = this.sliders.map(s => [this._subHeader(s.subheader), ...s.properties.map(this._mapSlider)]);
      sliders = Array.prototype.concat(...mappedSliders);
    } else {
      sliders = this.sliders[0].properties.map(this._mapSlider);
    }

    return (<div>{sliders}</div>);
  }
}

export default Settings;
