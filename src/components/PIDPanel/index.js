import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class PIDPanel extends React.Component {
  constructor(props) {
    super(props);

    this.pidValue = {
      p: 0,
      i: 0,
      d: 0
    }

  }

  setPIDValue(l, e) {
    const v = e.target.value
    this.pidValue[l] = parseFloat(v)
    if(Object.values(this.pidValue).some(isNaN)) {
      console.log(this.pidValue, "is not valida")
      return // do not set the value here
    }
    this.props.onPIDValueChange(this.pidValue)

  }
  getClassName() {
    const { hidden } = this.props
    if(hidden) return "PIDPanel PIDPanel-hidden"
    else return "PIDPanel"
  }
  /*
  <TextField label="hi" fullWidth={true} ></TextField>

  */
  render() {
    return (
      <div className="PIDPanel" style={this.props.hidden?{display: 'none'}:{}}>
        {
          'p,i,d'.split(',').map(lbl => (
            <TextField
                label={lbl.toUpperCase()}
                fullWidth={true}
                error={isNaN(parseFloat(this.pidValue[lbl]))}
                onChange={this.setPIDValue.bind(this, lbl)}
              />
          ))
        }
      </div>
    )
  }
}
