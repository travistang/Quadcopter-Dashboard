import React from 'react'
export default function(WrappedComponent, interval) {
  class Component extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        lastUpdate: new Date(),
        interval
      }
    }

    debounce(func) {
      const now = new Date()
      if ((now - this.state.lastUpdate) < this.state.interval) {
        return
      }
      func()
      this.setState({ lastUpdate: now })
    }

    render() {
      return (<WrappedComponent
        {...this.props}
        debounce={this.debounce.bind(this)}
      />)
    }
  }

  return Component
}
