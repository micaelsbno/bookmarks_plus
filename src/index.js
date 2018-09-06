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

  updateSession = (token, bookmarks, user_id = this.props.user_id, form = this.props.form) => {
    this.setState({ token, bookmarks, user_id,form: form})
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

    const state = this.state
    const updateSession = this.updateSession

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      var activeTab = tabs[0];
      var activeTabId = activeTab.id;

      const lastIndex = state.bookmarks
        .filter( mark => mark.folder === folder)
        .map( mark => mark.index)
        .sort( (a,b) => a - b)
        [0]

        
      axios.post('http://localhost:2999/bookmarks', {url: activeTab.url,title: activeTab.title, folder: folder, user_id: state.user_id, index: lastIndex + 1 })
      .then( response  => {
          if (response[0] !== 'error') {
            updateSession(response.data[0], response.data[1], response.data[2], 'hidden')
          }
        }    
      )
    })

  }

  showAddPopup = () => {
    axios.get('http://localhost:2999/bookmarks/', { params: {user_id: this.state.user_id } })
    .then( response => {
      if (response[0] !== 'error') {
        const allFolders = []
        response.data.forEach( bookmark => {
          if (!allFolders.includes(bookmark.folder)){
            allFolders.push(bookmark.folder)
          }
        })

        if (this.state.form === 'hidden') {
          this.setState({
            form: 'show',
            folders: allFolders
          })          
        } else {
          this.setState({
            form: 'hidden',
            folders: allFolders
          })      
        }

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
