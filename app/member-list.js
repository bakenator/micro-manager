import React, { Component } from 'react'
import { render } from 'react-dom'
import autobind from 'react-autobind'

export default class MemberList extends Component {
  constructor (props) {
    super(props)
    autobind(this)
  }

  render () {
    const {members, selectedUsers, updateSelectedUser, updateGroup, groups} = this.props

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

    const groupList = groups.map(g => {
      return (
        <div 
          className={`member-item group-item`}
          key={g.name}
          onClick={() => updateGroup(g)}
          > 
          {g.name}
        </div>
      )
    })

   return ( <div className="member-list">
      <h4 className="title">Office Drones</h4>
        <div className='members-holder'>
          <ul>
            {memberList}
            {groupList}
          </ul>
        </div>
    </div> )
  }
}
