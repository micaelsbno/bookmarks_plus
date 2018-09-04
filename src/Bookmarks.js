import React from 'react'
import Folder from './Folder'

export default class Bookmark extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      bookmarks: props.bookmarks,
      folders: {}
    }
  }
 
 mountBookmarks() {
  const allBookmarks = {tasks: {}, columnOrder: [], columns: {}}

  // this creates folders
  this.state.bookmarks.forEach( bookmark => {
    !allBookmarks.columnOrder.includes(bookmark.folder) ? allBookmarks.columnOrder.push(bookmark.folder) : ''
  })

  // this creates bookmarks
    allBookmarks.columnOrder.forEach( bookmark => {
      allBookmarks.columns[bookmark] = {
        id: bookmark,
        title: bookmark,
        taskIds: this.state.bookmarks.filter( mark => mark.folder === bookmark ).map( mark => mark.id)
      }
    })

  // this creates tasks 
    this.state.bookmarks.forEach( bookmark => {
      allBookmarks.tasks[bookmark.id] = {
        id: bookmark.id,
        content: `<a href="${bookmark.url}">${bookmark.title}</a>`
      }
    })
    this.setState({
      folders: allBookmarks
    })
 }

  render(){
    if (!!this.state.folders.columnOrder) {
    return (
      <div>
        <Folder folders={this.state.folders} />
      </div>
      )
    } else {
     return ( <div>{this.mountBookmarks()}</div> )
    }
  }
}