import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Folder from './Folder'

import { history } from '../store'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../actions/bookmarkActions'
import * as userActions from '../actions/userActions'

class BookmarksContainer extends React.Component {

  logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    this.props.logoutUser()
    this.props.hideBookmarks()
  }

  render() {
    if (!!this.props.user.token && !!this.props.bookmarks) {
      let folders = this.props.bookmarks
      return (
        <div>
          <button onClick={this.logout}>Logout</button> 
          <DragDropContext onDragEnd={this.props.dragBookmark}>
          {folders.folderOrder.sort().map(folderId => {
            const folder = folders.folders[folderId]
            const bookmarks = folder.bookmarkIds.map(bookmarkId => folders.bookmarks[bookmarkId])
            return <Folder key={folder.id} {...this.props} folder={folder} bookmarks={bookmarks} />
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
