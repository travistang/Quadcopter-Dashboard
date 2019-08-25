import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { PID_PANELS } from '../../backend/constants';
import PIDPanel from '../PIDPanel';
import "./style.css"
export default class PIDPanelContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pidPanel: 0
    }
  }
  switchPanel(evt, newValue) {
    this.setState({ pidPanel: newValue })
  }

  render() {
    return (
      <div className="PIDPanelContainer">
        <Tabs
          value={this.state.pidPanel}
          onChange={this.switchPanel.bind(this)}
        >
          {PID_PANELS.map(lbl => (
            <Tab label={`${lbl.toUpperCase()} Axis`} />
          ))}
        </Tabs>
        {
          PID_PANELS.map(lbl => (
            <PIDPanel
              key={`${lbl}-panel`}
              onPIDValueChange={value => this.props.setPIDValue(lbl, value)}
              axis={lbl} hidden={lbl !== PID_PANELS[this.state.pidPanel]}/>
          ))
        }
      </div>
    )
  }
}
