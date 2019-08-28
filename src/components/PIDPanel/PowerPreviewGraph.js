import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js'
import { isEqual } from 'lodash'

export default class PowerPreviewGraph extends React.Component {
  getData() {
    // the data from -20 to 20 degrees
    const {min, max} = this.props
    let data = []
    for (let i = min; i < max; i++) {
      data.push({x: i, y: this._computePIDValueAt(i) })
    }
    return {datasets: [
      {label: 'power', data, borderColor: 'red'}
      ]
    }
  }
  componentDidUpdate(prevProps) {
    if(this.props.baseThrust !== prevProps || !isEqual(prevProps.pidValue, this.props.pidValue))
    this.graph && this.graph.chartInstance.update()
  }
  // simulate the calculation of PID given the "p" value (I, D) depends on the actual error: not added for now
  _computePIDValueAt(error) {
    const { pidValue: { p }} = this.props
    return p * error + (205 + (350 - 205) * this.props.baseThrust);
  }

  getChartOptions() {
    const data = this.getData()
    return {
      title: {
        display: true,
        text: "Power output"
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0.5,
      },
      yAxes: [{
        min: 205,
        max: 380,
      }]
    }
  }
  render() {
    return (
      <div className="PowerPreviewGraph">
        <Line
          ref={ref => this.graph = ref}
          height="100%"
          data={this.getData()}
          options={this.getChartOptions()}
        />
      </div>
    )
  }
}
