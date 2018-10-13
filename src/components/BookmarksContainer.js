import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Folder from './Folder'
import axios from 'axios'
import apiUrl from '../helpers/apiUrl'
import mountBookmarks from '../helpers/mountBookmarks'
import Login from './Login'

import { history } from '../store'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../actions/bookmarkActions'
import * as userActions from '../actions/userActions'

class BookmarksContainer extends React.Component {

  onDragEnd = result => {
    const {destination, source, draggableId } = result

    if (!destination){
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
      ) {
      return
    }
    
    const folder = this.props.folders.folders[source.droppableId]
    const newTaskIds = Array.from(folder.taskIds)
    
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)

    newTaskIds.forEach( (markId, index) => {
      axios.put(apiUrl + 'bookmarks/' + markId, {markId, index, finished: this.props.folders.tasks[[markId]].finished})
      .then(
        response => {
          let folders = mountBookmarks(response.data[1])
          this.props.updateSession(response.data[0], folders)
        })
    })
  }

  logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    this.props.logoutUser()
    this.props.hideBookmarks()
  }

  render() {
    if (!!this.props.user.token && !!this.props.bookmarks.bookmarks) {
        let folders = this.props.location.state.bookmarks
      return (
        <div>
          <button onClick={this.logout}>Logout</button> 
          <DragDropContext onDragEnd={this.onDragEnd}>
          {folders.folderOrder.sort().map(folderId => {
            const folder = folders.folders[folderId]
            const bookmarks = folder.bookmarkIds.map(bookmarkId => folders.bookmarks[bookmarkId])
            return <Folder key={folder.id} folder={folder} bookmarks={bookmarks} updateSession={this.props.updateSession} />
          })}
          </DragDropContext>
        </div>
      )
    } else {
       return (<div>{history.push('/login')}</div>)
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  bookmarks: state.bookmarks
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...userActions, ...bookmarkActions}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarksContainer)
