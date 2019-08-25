import React from 'react';
import withMqtt from './backend/withMqtt';
import './App.css';
import { SERVER_URL, MQTT_ID } from './backend/constants'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PlotCard from './components/PlotCard';
import ControlPanel from './components/ControlPanel';
import PIDPanelContainer from './components/PIDPanelContainer';
import MotorPowerGraph from './components/MotorPowerGraph';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Joystick from './components/Joystick';
import TextField from '@material-ui/core/TextField';
class App extends React.Component {
  changeServerAddress() {
    const addr = document.getElementById('serverAddressInput').value
    console.log("using address", addr)
    this.props.initializeClient && this.props.initializeClient(addr)
  }
  render() {
    return (
        <div className="AppContainer">
          <AppBar position="static" color="primary" className="AppBar">
            <Toolbar className="Toolbar">
              Quadcopter Dashboard <br />
              {
                this.props.isDroneOffline && (
                  <Chip label="Drone Offline" color="secondary" />
                )
              }
              <div style={{flex: 1}} />
              {
                this.props.connected && (
                  <Chip label="Connected to MQTT Server" color="primary" />
                )
              }
              <TextField
                margin="dense"
                variant="outlined"
                color="secondary"
                id="serverAddressInput"
                placeholder="MQTT Broker Address"
                InputProps={{
                  classes: {
                    root: "ServerURLInputField"
                  }
                }}
                className="ServerURLInputField"/>
              <Button
                onClick={this.changeServerAddress.bind(this)}
                variant="contained" color="secondary"> Connect </Button>
            </Toolbar>
          </AppBar>
          <div className="App">
            <div className="Row">
              <PlotCard title="Combined Angle Estimate" data={this.props.estimatedAngle} />
              <PIDPanelContainer setPIDValue={this.props.setPIDValue} />
            </div>
            <div className="Row">
              <Joystick sendTargetPose={this.props.sendTargetPose}/>
              <MotorPowerGraph motorPower={this.props.motorPower} />
              <ControlPanel
                setPIDValue={this.props.setPIDValue}
                sendBaseThrust={this.props.sendBaseThrust}
                publishGyroAccelRatio={this.props.sendGyroAcclRatio}
                sendRecalibrateGyro={this.props.sendRecalibrateGyro}
              />
            </div>
          </div>
      </div>
    );
  }

}

export default withMqtt(App, SERVER_URL, MQTT_ID);
