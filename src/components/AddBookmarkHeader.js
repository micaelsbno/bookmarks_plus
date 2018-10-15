import React from 'react'

/*global chrome*/

class AddBookmarkHeader extends React.Component {

  constructor (props) {
    super(props) 
    this.state = {
      form: 'hidden'
    }
  }

  addBookmark = (folder) => {
    let tabs = chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      return tabs
    })

   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      var activeTab = tabs[0];
      this.props.addBookmark(folder, activeTab)
    })
    this.toggleForm()
  }

  toggleForm = () => {
    this.setState({
      form: this.state.form === 'show' ? 'hidden' : 'show'
    })
  }
  
  createFolder = (e) => {
    e.preventDefault()
    this.addBookmark(e.target.firstElementChild.value)
  }

  render () {
    return (
      <div className='bookmarks'>
        <header><h1>Add Bookmark</h1><i className="fas fa-plus" onClick={this.toggleForm}></i></header>
        <div className={this.state.form}>
          {this.props.bookmarks.folderOrder.map((folder, i) => {
            return <div className="folder__selector" key={i} onClick={() => {this.addBookmark(folder)}}>{folder}</div>
          })}
          <form className='' onSubmit={this.createFolder}>
            <input type="text" ref='folder-input' name='folder-input' />
          <button>Send</button>
          </form>
        </div>
      </div>
    )     
  }
}

export default AddBookmarkHeader