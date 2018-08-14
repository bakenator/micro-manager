import React, { Component } from 'react'
import { render } from 'react-dom'
import autobind from 'react-autobind'

export default class InfoModal extends Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
   return ( 
    <div className="info-modal">
      <h2>Welcome!</h2>
      <p>The MicroManager App &trade; allows you to track user&#39;s github events as they occur</p>
      <p>You can select the workers you want to follow by hovering the <code>office drones</code> menu in the top right</p>
      <p>Events that occured in the last <strong>30 minutes</strong> are shown with green backgrounds</p>
      <p>Events are updated every minute, there is no need to refresh the page</p>
      <p>The first worker&#39;s events are shown by default so you can see how little work they do.</p>
      <p><strong>Click anywhere</strong> to clear this pop up</p>
    </div> )
  }
}
