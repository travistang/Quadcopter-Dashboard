import React from 'react';
import Slider from '@material-ui/core/Slider';
import debounce from '../../backend/debounce'
import Button from '@material-ui/core/Button';
import PowerPreviewGraph from './PowerPreviewGraph';
import "./style.css";

class PIDPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPowerGraph: false,
      pidValue: {
        p: 0,
        i: 0,
        d: 0
      }
    }
  }

  setPIDValue(l, e, v) {
    this.props.debounce(
      () => {
        this.setState({ pidValue: {...this.state.pidValue, [l]: v}})
        this.props.onPIDValueChange(this.state.pidValue)
      }
    )
  }

  getClassName() {
    const { hidden } = this.props
    if(hidden) return "PIDPanel PIDPanel-hidden"
    else return "PIDPanel"
  }
  togglePowerGraph() {
    this.setState({ showPowerGraph: !this.state.showPowerGraph})
  }
  render() {
    const { showPowerGraph } = this.state
    return (
      <div className="PIDPanelWrapper">
        <div className="PIDPanel" style={this.props.hidden?{display: 'none'}:{}}>
          {
            !showPowerGraph?(
              'p,i,d'.split(',').map(lbl => (
                <div className="">
                  {`${lbl.toUpperCase()}: ${this.state.pidValue[lbl].toFixed(2)}`}
                  <Slider aria-label={lbl.toUpperCase()}
                    value={this.state.pidValue[lbl]}
                    onChange={this.setPIDValue.bind(this, lbl)}
                    min={0} max={1} step={1e-2}
                  />
                </div>
              ))
            ): (
              <PowerPreviewGraph
                min={-20}
                max={20}
                baseThrust={this.props.baseThrust}
                pidValue={this.state.pidValue} />
            )
          }
          <div className="PIDActionButtonGroup">
            {
              !showPowerGraph && ([
                <Button color="secondary">
                  Set as default
                </Button>,
                <Button>
                  Reset
                </Button>
              ])
            }
            <Button onClick={this.togglePowerGraph.bind(this)}>
              {showPowerGraph?"Tune PID Value":"Graph"}
            </Button>
          </div>
        </div>
      </div>

    )
  }
}

export default debounce(PIDPanel, 200)
