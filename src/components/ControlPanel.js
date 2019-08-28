import React from 'react'
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default class ControlPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      totalThrust: 0.0,
      gyroAccelRatio: 0.98
    }
    this.last_thrust_sent = new Date()
  }
  resetBaseThrust() {
    this.setState({ totalThrust: 0.0 }, () => {
      this.props.sendBaseThrust && this.props.sendBaseThrust(this.state.totalThrust)
    })
  }
  publishBaseThrust(evt, thrust) {
    const now = new Date()
    this.setState({ totalThrust: thrust })
    // send with throttle..
    if ((now - this.last_thrust_sent) > 200) {
      this.props.sendBaseThrust && this.props.sendBaseThrust(thrust)
      this.last_thrust_sent = now
    }
  }
  publishGyroAccelRatio() {
    const { gyroAccelRatio } = this.state
    this.props.publishGyroAccelRatio(gyroAccelRatio)
  }

  render() {
    return (
      <div className="ControlPanel">
        <div className="ControlPanelInner">
          <div className="ControlPanelSection">
            <div>
              Gyro-Accl Ratio: {this.state.gyroAccelRatio}
              <Slider
                aria-label="Gyro-Accl"
                value={this.state.gyroAccelRatio}
                onChange={(_, v) => this.setState({ gyroAccelRatio: v})}
                onChangeCommitted={this.publishGyroAccelRatio.bind(this)}
                max={1} min={0} step={1e-2}
              />
            </div>

          <Button
            onClick={this.props.sendRecalibrateGyro}
            variant="contained" color="secondary">
              Recalibrate Gyro
            </Button>
          </div>

          <div className="ThrustSectionContainer">
            <Typography>Thrust: {this.state.totalThrust.toFixed(3)}</Typography>
            <br />
            <Slider orientation="vertical"
              aria-label="Thrust"
              onChange={this.publishBaseThrust.bind(this)}
              value={this.state.totalThrust}
              max={1} min={0} step={1e-3}
            />
            <br />
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.resetBaseThrust.bind(this)}>
              STOP
            </Button>
          </div>

        </div>
    </div>
    )
  }
}
