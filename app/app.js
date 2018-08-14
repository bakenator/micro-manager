/* global document */
import React, { Component } from 'react'
import { render } from 'react-dom'
import autobind from 'react-autobind'
import UserBox from './user-box'
import MemberList from './member-list'
import InfoModal from './info-modal'

class Root extends Component {
  constructor (props) {
    super(props)
    this.state = {
      githubEvents: [],
      githubMembers: [],
      eventsByUser: {},
      //setting me to appear as the default
      selectedUsers: {},
      showModal: true
    }
    autobind(this)
  }

  componentDidMount() {
      window.socket.on('startingEventList', this.setGithubEvents);
      window.socket.on('updateEventList', this.setGithubEvents);
      window.socket.on('newEvent', this.addNewEvent);
      socket.emit('appLoad', {});
  }

  setGithubEvents({githubEvents, githubMembers, rawEvents}) {
    const {selectedUsers} = this.state;

    const eventsByUser = {}
    githubEvents.forEach(e => {
      if (e.user in eventsByUser) {
        eventsByUser[e.user].push(e)
      } else {
        eventsByUser[e.user] = [e]
      }
    })

    const activeMembers = githubMembers.filter(g => eventsByUser[g.user]).sort((a,b) => a.user.localeCompare(b.user));
    const firstUser = activeMembers[0]
    const setSelectedUsers = (firstUser && !Object.keys(selectedUsers).length) ? {[firstUser.user]: firstUser} : selectedUsers;

    // only showing users with contributions
    this.setState({
      githubEvents,
      githubMembers: activeMembers,
      eventsByUser,
      selectedUsers: setSelectedUsers
    })
  }

  addNewEvent({newEvent}) {
    const {eventsByUser} = this.state;
    if (newEvent.user in eventsByUser) {
      eventsByUser[newEvent.user].unshift(newEvent);
      if (eventsByUser[newEvent.user].length > 50) {
        eventsByUser[newEvent.user] = eventsByUser[newEvent.user].slice(45);
      }
    } else {
      eventsByUser[newEvent.user] = [newEvent];
    }

    this.setState({eventsByUser})
    console.log(newEvent);
  }

  updateSelectedUser({user, user_pic}) {
    const {selectedUsers} = this.state;
    if (selectedUsers[user]) {
      delete selectedUsers[user];
    } else {
      selectedUsers[user] = {user, user_pic};
    }

    this.setState({selectedUsers})
  }

  clearModal() {
    if (!this.state.showModal) {return}
    this.setState({showModal: false})
  }

  get currentWinner() {
    const {eventsByUser} = this.state
    const users = Object.keys(eventsByUser)
    //finding the username with the most events
    return users.reduce((accum, user) => {
      if (!accum) {return user}
      if (eventsByUser[user].length > eventsByUser[accum].length) {return user}
      return accum
    }, '')
  }

  render () {
    const {githubEvents, githubMembers, eventsByUser, selectedUsers, showModal} = this.state;

    const shownUsers = Object.keys(selectedUsers)
    const userBoxes = shownUsers.map(u => {
      return (
        <UserBox 
          key={u}
          user={u}
          shownUsers={shownUsers}
          user_pic={selectedUsers[u].user_pic}
          events={eventsByUser[u] || []}
        />
      )
    })

    return (
      <div className="root" onClick={this.clearModal}>
        <MemberList 
          members={githubMembers} 
          selectedUsers={selectedUsers}
          updateSelectedUser={this.updateSelectedUser}/>
        {/* repoTitle is set in app.ejs */}
        <div className='repo-title'>
          <div>Currently Winning: {this.currentWinner}</div>
          <div>{repoTitle}</div>
          
        </div>
        <div className='user-box-holder'>
          {userBoxes}
        </div>
        {showModal && <InfoModal/>}
      </div>
    )
  }
}

render(
  <Root />,
  document.getElementById('react-root')
)
