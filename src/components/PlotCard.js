import React from 'react'

import { Line } from 'react-chartjs-2'
import 'chart.js'

export default class PlotCard extends React.Component {
  componentDidUpdate(prevProps) {
    if(prevProps.data.length !== this.props.data.length) {
      this.chart && this.chart.chartInstance.update()
    }
  }
  getChartOptions() {
    return {
      title: {
          display: true,
          text: 'Estimated Angle (degrees)'
      },
      elements: {
          line: {
              tension: 0
          }
      },
      bezierCurve: false,
      animation: {
          duration: 0.2
      },
      scales: {
          xAxes: [{
              ticks: {
                  display: false
              },
              gridLines: {
                  display:false
              }
          }],
          yAxes: [{
            gridLines: {
                display:false
            }
          }]
      }
    }
  }

  render() {
    return (
      <div className="PlotCard">
        <Line
          height='100%'
          ref={ref => this.chart = ref}
          data={this.props.data}
          options={this.getChartOptions()}
        />
      </div>

    )
  }
}
