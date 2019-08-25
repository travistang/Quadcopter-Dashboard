import React from 'react'
import { connect } from 'mqtt';
import {
  SUBSCRIBE_CHANNELS, PUBLISH_CHANNELS,
  NUM_RETAIN_DATA, PLOT_COLORS,
  SERVER_URL
} from './constants'
import * as _ from 'lodash'

export default function(WrappedComponent, serverAddress, clientId) {
  class Component extends React.Component {
    initializeClient(serverAddress) {
      console.log('initializing client with ', serverAddress, ' id ', clientId)
      this.setState({ connected: false })
      if(this.client) {
        this.client.end(true)
      }
      this.client = connect(`ws://${serverAddress}:1883`, clientId)
      this.client.on('connect', this.onConnect.bind(this))
      this.client.on('message', this.onMessage.bind(this))
    }
    constructor(props) {
      super(props)

      this.initializeClient(SERVER_URL)
      this.state = {
        motorPower: null,
        connected: false, // to server...
        lastTimeDroneOnline: new Date(),
        isDroneOffline: true
      }

      this.acclData = {
        datasets: 'x,y,z'.split(',').map((label, i) => this.makeDataset(label, i)),
        labels: []
      }
      this.gyroData = {
        datasets: 'x,y,z'.split(',').map((label, i) => this.makeDataset(label, i)),
        labels: []
      }
      this.estimatedAngle = {
        datasets: 'x,y,z'.split(',').map((label, i) => this.makeDataset(label, i)),
        labels: []
      }

      this.checkDroneOnlineRoutine = setInterval(
        () => {
          const isDroneOffline = (new Date() - this.state.lastTimeDroneOnline) > 1000
          if(isDroneOffline !== this.state.isDroneOffline) {
            this.setState({ isDroneOffline })
          }
        }
      , 2000)
      // this.gyroData = []
    }

    makeDataset(label, i) {
      return {
        label,
        fill: false,
        data: [],
        backgroundColor: PLOT_COLORS[i % PLOT_COLORS.length],
        lineTension: 0.7,
      }
    }

    onConnect() {
      this.setState({ connected: true })
      Object.values(SUBSCRIBE_CHANNELS).forEach(chan => this.client.subscribe(chan, {
        onFailure: () => console.log('subscribe failed')
      }))
    }

    _addData3(dataName, newData) {
      Object.keys(newData).forEach(label => {
        let dataset = this[dataName].datasets.find(dataset => dataset.label === label)
        dataset.data = _.takeRight([...dataset.data, newData[label]], NUM_RETAIN_DATA)
      })

      this[dataName].labels = _.takeRight([...this[dataName].labels, Math.random()], NUM_RETAIN_DATA)
    }

    addAcclData(newData) {
      this._addData3("acclData", newData)
    }
    addGyroData(newData) {
      this._addData3("gyroData", newData)
    }
    addEstimatedAngle(newData) {
      this._addData3("estimatedAngle", newData)
    }

    onMessage(topic, payload) {
      const message =  new TextDecoder("utf-8").decode(payload);
      const data = JSON.parse(message.replace(/'/g, '"'))
      switch(topic) {
        case SUBSCRIBE_CHANNELS.GYRO:
          this.addGyroData(data)
          break
        case SUBSCRIBE_CHANNELS.ACCL:
          this.addAcclData(data)
          break
        case SUBSCRIBE_CHANNELS.ANGLE:
          this.addEstimatedAngle(data)
          break
        case SUBSCRIBE_CHANNELS.MOTOR:
          this.setState({ motorPower: data })
          break
        default:
          break
      }
      this.setState({ lastTimeDroneOnline: new Date() })
    }

    clearGyroData() {    }

    sendGyroAcclRatio(ratio) {
      this.client.publish(PUBLISH_CHANNELS.SET_GYRO_ACCL_RATIO, ratio.toString())
    }
    sendRecalibrateGyro() {
      this.client.publish(PUBLISH_CHANNELS.RECALIBRATE_GYRO, "recalibrate")
    }
    sendBaseThrust(thrust) {
      this.client.publish(PUBLISH_CHANNELS.THRUST, thrust.toString())
    }
    sendTargetPose(pose) {
      this.client.publish(PUBLISH_CHANNELS.TARGET_POSE, JSON.stringify(pose))
    }
    sendPIDValue(axis, value) {
      console.log("send PID Value:", PUBLISH_CHANNELS.SET_PID, axis, value)
      this.client.publish(PUBLISH_CHANNELS.SET_PID, JSON.stringify({
        axis,
        ...value
      }))
    }

    render() {
      return <WrappedComponent
          mqttClient={this.client}
          sendBaseThrust={this.sendBaseThrust.bind(this)}
          setPIDValue={this.sendPIDValue.bind(this)}
          sendRecalibrateGyro={this.sendRecalibrateGyro.bind(this)}
          sendGyroAcclRatio={this.sendGyroAcclRatio.bind(this)}
          initializeClient={this.initializeClient.bind(this)}
          {...this}
          {...this.state}
        />
    }
  }
  return Component
}
