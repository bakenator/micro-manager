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
        <div 
          className={`member-tile ${selectedClass}`}
          key={m.user}
          onClick={() => updateSelectedUser(m)}
          > 
          {m.user}
        </div>
      )
    })

    const groupList = groups.map(g => {
      return (
        <div 
          className={`member-tile group-tile`}
          key={g.name}
          onClick={() => updateGroup(g)}
          > 
          {g.name}
        </div>
      )
    })

   return ( <div className="member-list">
      <div className="title">OFFICE DRONES</div>
        <div className='members-holder'>
          {memberList}
          {groupList}
        </div>
    </div> )
  }
}
