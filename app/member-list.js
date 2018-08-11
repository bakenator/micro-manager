import React, { Component } from 'react'
import { render } from 'react-dom'
import autobind from 'react-autobind'

export default class MemberList extends Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
    const {members, selectedUsers, updateSelectedUser} = this.props

    const memberList = members.map(m => {
      const selectedClass = selectedUsers[m.user] ? 'selected-user' : ''
      return (
        <div 
          className={`member-tile ${selectedClass}`}
          key={m.user}
          onClick={() => updateSelectedUser(m)}
          > 
          {m.user}
        </div>
      )
    })

   return ( <div className="member-list">
      <div className="title">OFFICE DRONES</div>
        <div className='members-holder'>
          {memberList}
        </div>
    </div> )
  }
}
