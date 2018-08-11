/* global document */
import React, { Component } from 'react'
import { render } from 'react-dom'
import autobind from 'react-autobind'
import moment from 'moment'

export default class UserBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      top: 0,
      left: 0,
      mouseDown: false,
      mousePrevPos: { x: 0, y: 0 }
    }
    autobind(this)
  }

  displayEvent(e) {
    const minutesAgo = moment().diff(moment(e.time), 'minutes')
    const isNewClass = minutesAgo < 20 ? 'new-event' : ''

    return (
      <div key={e.id} className={`event-tile ${isNewClass}`}>
        <div className='event-icon'>
          {e.icon}
        </div>
        <div className='event-info'>
          <div className='event-text'>{e.text}</div>
          <div className='event-time'>{moment(e.time).format('lll')}</div>
        </div>
      </div>
    )
  }

  render () {
    const {user, user_pic, shownUsers, events} = this.props
    const boxWidth = 300;
    const sideMenuWidth = 30;
    const boxPerRow = Math.floor((window.innerWidth - sideMenuWidth) / boxWidth)
    const userRows = Math.ceil(shownUsers.length / boxPerRow)

    var boxHeight = {
      height: `${ 100 / userRows - 0.5 }vh`
    }

    return (
      <div className="user-box">
        <div className='title-bar'>
          <img height={50} width={50} src={user_pic} alt="githubPic"/>
          <div className='user-name'>{user}</div>
        </div>

        <div 
          className='event-list'
          style={boxHeight}>
          <div className='spacer-div'></div>
          {events && events.map(e =>{
            return this.displayEvent(e)
          })}
        </div>
      </div>
    )
  }
}
