import React from 'react';
import ReactNipple from 'react-nipple';
import "./style.css";

export default class Joystick extends React.Component {
  MAX_DISTANCE = 50 // the furthest distance the nipples report
  MAX_ANGLE = 15 // in degrees
  constructor(props) {
    super(props)
    this.state = {
      lastPublish: new Date(),

      // angle calculated, for debugging:
      angles: { x: 0, y: 0 }
    }
  }
  onMove(evt, data) {
    const now = new Date()
    if ((now - this.state.lastPublish) < 100) return
    this.setState({lastPublish: now})
    // compute the target angles given
    const { distance, angle: { radian }} = data
    const normalizedDistance = distance / this.MAX_DISTANCE
    const x = Math.sin(radian) * normalizedDistance * this.MAX_ANGLE
    const y = -Math.cos(radian) * normalizedDistance * this.MAX_ANGLE
    // multiply by the max angle you want to achieve
    this.props.sendTargetPose && this.props.sendTargetPose({ x, y })
    this.setState({ angles: { x, y }})
  }
  resetAngle() {
    this.setState({ angles: { x: 0, y: 0 }})
    this.props.sendTargetPose && this.props.sendTargetPose({ x: 0, y: 0})
  }
  render() {
    return (
      <div className="Joystick">
        <ReactNipple
          width={250}
          height={250}
          onEnd={this.resetAngle.bind(this)}
          onMove={this.onMove.bind(this)}
          options={{
            mode: "static",
            color: "blue",
            position: { top: "75vh", left: "18vw" }
          }}
        />
      </div>

    )
  }
}
