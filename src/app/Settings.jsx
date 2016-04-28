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
import Toggle from 'material-ui/lib/toggle';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';

class Settings extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnAdorner = this.setAdorner.bind(this);
        this._mapSlider = this._mapControl.bind(this);
        this._subHeader = this._subHeader.bind(this);
        this._onValuesChange = props.onValuesChange;
        this._onAdornerChange = props.onAdornerChange;

        const properties = props.properties;
        const createHandlers = (properties) => {
            return Object.keys(properties).map(prop => this._createPropertySettings(prop, properties[prop]));
        };
        this.sliders = Object.keys(properties).map(h => ({ subheader: h, properties: createHandlers(properties[h]) }));

        this.state = Object.assign({}, { values: props.values }, { muiTheme: context.muiTheme || getMuiTheme() });
    }

    handleOnChange(value, name) {
        let values = Object.assign({}, this.state.values, { [name]: value });
        this.setState({ values }, () => this._onValuesChange(this.state.values));
    }

    setAdorner(adorner) {
        if (this._onAdornerChange) {
            this._onAdornerChange(adorner);
        }
    }

    _createPropertySettings(prop, value) {
        function createSelect(value) {
            return {
                type: 'select',
                values: value.values,
            };
        }

        function createSlider(value) {
            return {
                type: 'slider',
                min: value.min || 0,
                max: value.max || 1,
                step: value.step || 0.01,
            };
        }

        function createCheckbox(value) {
            return {
                type: 'checkbox',
            };
        }

        let ext = null;

        if (typeof value === 'string') {
            value = {
                title: value,
            };
        }

        if (Array.isArray(value.values)) {
            ext = createSelect(value);
        }
        else if (typeof value.value === "boolean") {
            ext = createCheckbox(value);
        }
        else {
            ext = createSlider(value);
        }

        if (value.validFor) {
            ext.validFor = value.validFor;
        }

        return Object.assign({
            title: value.title,
            adorner: value.adorner || prop,
            prop: prop,
            handler: (evt, value) => this.handleOnChange(value, prop),
        }, ext);
    }

    _mapControl(s) {
        let value = this.state.values[s.prop];
        let control = null;
        switch (s.type) {
            case 'select':
                let values = s.values.map(v => <MenuItem key={v.value} value={v.value} primaryText={v.title}/>)

                return (
                    <div key={s.prop} onMouseEnter={() => this.setAdorner(s.adorner)} onMouseLeave={() => this.setAdorner(null)} style={{ margin: 7 }}>
                        <SelectField fullWidth={true} value={value} onChange={s.handler}>
                            {values}
                        </SelectField>
                    </div>
                );
            case 'slider':
                return (
                    <div key={s.prop} onMouseEnter={() => this.setAdorner(s.adorner)} onMouseLeave={() => this.setAdorner(null)}>
                        <div className="value">{s.title} ({value}) </div>
                        <Slider className="slider" name="rotate" style={{ marginTop: 7, marginBottom: 7 }} min={s.min} max={s.max} step={s.step} value={value} onChange={s.handler}/>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={s.prop} onMouseEnter={() => this.setAdorner(s.adorner)} onMouseLeave={() => this.setAdorner(null)}>
                        <Toggle style={{}} label={s.title} labelPosition="right" labelStyle={{textAlign: 'center', marginLeft: -18, marginRight: 18}}
                           toggled={value} onToggle={(evt, value) => s.handler(evt, value)}/>
                    </div>
                );
        }
    }

    _subHeader(name) {
        const muiTheme = this.state.muiTheme;
        let themeVariables = muiTheme.appBar;

        return (<div className="value" key={name} style={{ backgroundColor: themeVariables.color, color: themeVariables.textColor, padding: 5 }}>{name}</div>);
    }

    render() {
        const getPropertis = (properties) => {
            return properties
                .filter(prop => {
                    if (!prop.validFor) {
                        return true;
                    }

                    const validProps = Object.keys(prop.validFor);
                    for (let validProp = 0; validProp < validProps.length; validProp++) {
                        const validValues = prop.validFor[validProps[validProp]];
                        const value = this.state.values[validProps];
                        if (validValues.indexOf(value) >= 0) {
                            return true;
                        }
                    }

                    return false;
                })
                .map(prop => this._mapControl(prop));
        };

        let mappedControls = this.sliders.map(s => [this._subHeader(s.subheader), ...getPropertis(s.properties)]);
        let controls = Array.prototype.concat(...mappedControls);
        if (this.sliders.length === 1) {
            controls = controls.slice(1);
        }

        return (<div>{controls}</div>);
    }
}

export default Settings;
