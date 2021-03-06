import React from 'react'
import Folder from './Folder'

export default class Bookmark extends React.Component{
  
  // rerun mountBookmarks

  mountBookmarks = () => {
    let { bookmarks } = this.props
    const allBookmarks = {tasks: {}, columnOrder: [], columns: {}}

    // this creates folders
    bookmarks.forEach( bookmark => {
      !allBookmarks.columnOrder.includes(bookmark.folder) ? allBookmarks.columnOrder.push(bookmark.folder) : ''
    })

    // this creates bookmarks
    allBookmarks.columnOrder.forEach( bookmark => {
      allBookmarks.columns[bookmark] = {
        id: bookmark,
        title: bookmark,
        taskIds: bookmarks
          .sort((markA, markB) => markA.index - markB.index)
          .filter( mark => mark.folder === bookmark )
          .map( mark => mark.id)
      }
    })

    // this creates tasks
    bookmarks.forEach( bookmark => {
      allBookmarks.tasks[bookmark.id] = {
        id: bookmark.id,
        content: bookmark.title,
        url: bookmark.url,
        finished: bookmark.finished
      }
    })
    return allBookmarks
  }

  render() {
    return (
      <div>
        <Folder folders={this.mountBookmarks()} updateSession={this.props.updateSession} />
      </div>
    )
  }
}