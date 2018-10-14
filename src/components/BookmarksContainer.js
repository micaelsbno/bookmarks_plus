import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Folder from './Folder'
import AddBookmarkHeader from './AddBookmarkHeader'

import Login from './Login'
import { history } from '../store'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../actions/bookmarkActions'
import * as userActions from '../actions/userActions'

class BookmarksContainer extends React.Component {

  logout = () => {
    localStorage.clear()
    this.props.logoutUser()
    this.props.hideBookmarks()
  }

  render() {
      return (
        !!this.props.user.token && !!this.props.bookmarks ? ( 
        <div>
          <AddBookmarkHeader {...this.props} />
          <button onClick={this.logout}>Logout</button> 
          <DragDropContext onDragEnd={this.props.dragBookmark}>
          {this.props.bookmarks.folderOrder.sort().map(folderId => {
            const folder = this.props.bookmarks.folders[folderId]
            const bookmarks = folder.bookmarkIds.map(bookmarkId => this.props.bookmarks.bookmarks[bookmarkId])
            return <Folder key={folder.id} {...this.props} folder={folder} bookmarks={bookmarks} />
          })}
          </DragDropContext>
        </div>
        ) : (
          <Login />
        )
      )
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
