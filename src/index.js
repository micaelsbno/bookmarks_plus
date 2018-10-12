import React from 'react'
import ReactDOM from 'react-dom';
import Login from './Login'
import Signup from './Signup'
import Bookmarks from './Bookmarks'
import axios from 'axios'
import './index.css'
import apiUrl from './apiUrl'
import mountBookmarks from './helpers/mountBookmarks'

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
      bookmarkFolder: '',
      user_id: 0
    }
  }
  
  checkStorage = () => {
    if (!!localStorage.getItem('email')) {
      axios.post(
        apiUrl + 'sessions', 
        {email: localStorage.getItem('email'), 
        password: localStorage.getItem('password')
      })
        .then( response => {
          if (response[0] !== 'error') {
            let folders = mountBookmarks(response.data[1])
            this.updateSession(response.data[0], folders, response.data[2])
          }
        })
    }
  }

  updateSession = (
    token,
    folders = this.state.folders,
    user_id = this.state.user_id,
    form = this.state.form,
    bookmarkFolder = this.state.bookmarkFolder
  ) => { this.setState( { token, folders, user_id,form: form } ) }

  userIsLoggedIn = () => {
    return this.state.token === 'token'
  }
  
  goTo (link) {
    this.setState({
      page: link
    })
  }

  addBookmark = (folder) => {
    if (folder !== '') {
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

        axios.post(apiUrl + 'bookmarks', {url: activeTab.url,title: activeTab.title, folder: folder, user_id: this.state.user_id, index: lastIndex + 1 })
        .then( response  => {
          if (response[0] !== 'error') {
            updateSession(response.data[0], response.data[1], response.data[2])
            this.setState({form: 'hidden'})
          }
        })
      })
    }
  }

  showAddPopup = () => {
    axios.get(apiUrl + 'bookmarks/', { params: {user_id: this.state.user_id } })
    .then( response => {
      const allFolders = []
      if (response[0] !== 'error') {
        response.data.forEach( bookmark => {
          if (!allFolders.includes(bookmark.folder)){
            allFolders.push(bookmark.folder)
          }
        })
      }

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
    })
  }

  addBookmarkFolders = (folder) => {
    return <div className="folder__selector" onClick={() => {this.addBookmark(folder)}}>{folder}</div>
  }
  
  update = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    this.updateSession('', [])
  }

  renderBookmarks = () => (
    <div className='bookmarks'>
      <header>
        <h1>Add Bookmark</h1>
        <i className="fas fa-plus" onClick={this.showAddPopup}></i>
      </header>
{/*      <div className={this.state.form}>
        {this.state.folders.sort().map(this.addBookmarkFolders)}
        <form 
          className='new-folder__form' 
          onSubmit={ event => {
            event.preventDefault()
            this.addBookmark(this.state.bookmarkFolder)
          }}
         action='/bookmarks' method='post' 
        >
          <input 
            type='text' 
            placeholder='New Folder' 
            name='bookmarkFolder' 
            onChange={this.update} 
          />
          <button>Send</button>
        </form>
      </div>*/}
      <div className="subhead">
        <h4 className='bookmarks__title'>BOOKMARKS</h4>
        <h4 className="bookmarks__title--red" onClick={this.logout}>LOGOUT</h4>
      </div>
      <Bookmarks folders={this.state.folders} updateSession={this.updateSession}/>
    </div>
  ) 

  renderLogin = () => (
    <div>
      <p>{this.state.test}</p>
      <Login updateSession={this.updateSession} logInUser={this.logInUser} />
      <p className='link' onClick={() =>{this.goTo('signup')}}>Or sign up</p>
    </div>
  )

  renderSignup = () => (
    <div>
      <Signup updateSession={this.updateSession} />
      <p className='link' onClick={() => {this.goTo('login')}}>Go back to login</p>
    </div>
  )

  render() {
    if (!!localStorage.getItem('email') && !this.userIsLoggedIn() && this.state.token !== 'error') {
      return <div>{this.checkStorage()}</div>
    } else if (this.userIsLoggedIn()) {
      return this.renderBookmarks()   
    } else if (this.state.page === 'login') {   
      return this.renderLogin()
    } else {
      return this.renderSignup()
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
