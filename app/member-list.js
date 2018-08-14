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
        <li 
          className={`member-item ${selectedClass}`}
          key={m.user}
          onClick={() => updateSelectedUser(m)}
          > 
          {m.user}
        </li>
      )
    })

   return ( <div className="member-list">
      <h4 className="title">Office Drones</h4>
        <div className='members-holder'>
          <ul>
            {memberList}
          </ul>
        </div>
    </div> )
  }
}
