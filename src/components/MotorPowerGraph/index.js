import React from 'react';
import { MOTOR_TAGS } from '../../backend/constants';
import Card from '@material-ui/core/Card';
import DroneImage from './drone.png';
import {Doughnut} from 'react-chartjs-2'

import './style.css';

const style = {
  container: {
    backgroundImage: `url(${DroneImage})`,
    backgroundSize: '100%',
  }
}
export default class MotorPowerGraph extends React.Component {

  render() {
    return (
      <Card className="MotorPowerGraph" style={style.container}>
        { this.props.motorPower && MOTOR_TAGS.map(tag => (
          <div className="MotorPowerGraphInnerContainer">
            <Doughnut

            options={{legend: {display: false }}}
            data={{
              labels: [tag, 'not-empty'],
              datasets: [{
                backgroundColor: ['red', 'rgba(128, 128, 128, 0.3)'],
                data: [this.props.motorPower[tag], 450 - this.props.motorPower[tag]],

              }]
            }} />
          </div>
        ))}

      </Card>
    )
  }
}
