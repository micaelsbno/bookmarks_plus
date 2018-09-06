import React from 'react'
import ReactDOM from 'react-dom';
import Login from './Login'
import Signup from './Signup'
import Bookmarks from './Bookmarks'
import axios from 'axios'
import './index.css'

/*global chrome*/

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      bookmarks: [],
      page: 'login',
      form: 'hidden',
      folders: [],
      user_id: 0
    }
  }

  updateSession = (token, bookmarks, user_id) => {
    this.setState({ token, bookmarks, user_id})
  }

  userIsLoggedIn = () => {
    return this.state.token === 'token'
  }
  
  goTo (link) {
    this.setState({
      page: link
    })
  }

  addBookmark = (folder) => {
    console.log(folder)
    const tabs = []
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
       var activeTab = tabs[0];
       var activeTabId = activeTab.id;
       tabs.push(tabs)
    });
  }

  showAddPopup = () => {
    console.log(this.state.user_id)
    axios.get('http://localhost:2999/bookmarks/', { params: {user_id: this.state.user_id } })
    .then( response => {
      if (response[0] !== 'error') {
        const allFolders = []
        response.data.forEach( bookmark => {
          if (!allFolders.includes(bookmark.folder)){
            allFolders.push(bookmark.folder)
          }
        })
          this.setState({
            form: 'show',
            folders: allFolders
          })
        }
    })
  }

  addBookmarkFolders = (folder) => {
    return <div className="folder__selector" onClick={() => {this.addBookmark(folder)}}>{folder}</div>
  }

  render() {
    if (this.userIsLoggedIn()) {
      return (
        <div className='bookmarks'>
          <header><h1>Add Bookmark</h1><i className="fas fa-plus" onClick={this.showAddPopup}></i></header>
          <div className={this.state.form}>
            {this.state.folders.map(this.addBookmarkFolders)}
          </div>
          <h4 className='bookmarks__title'>BOOKMARKS</h4>
          <Bookmarks bookmarks={this.state.bookmarks} updateSession={this.updateSession}/>
        </div>
      )
    } else if (this.state.page === 'login') {   
      return (
        <div>
          <p>{this.state.test}</p>
          <Login updateSession={this.updateSession} />
          <p className='link' onClick={() =>{this.goTo('signup')}}>Or sign up</p>
        </div>
      )
    } else {
      return (
        <div>
          <Signup updateSession={this.updateSession} />
          <p className='link' onClick={() => {this.goTo('login')}}>Go back to login</p>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
