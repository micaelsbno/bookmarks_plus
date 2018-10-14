import React from 'react'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route } from 'react-router'

import axios from 'axios'
import { history, store } from './store'

import Login from './components/Login'
import Signup from './components/Signup'
import BookmarksContainer from './components/BookmarksContainer'

import apiUrl from './helpers/apiUrl'
import mountBookmarks from './helpers/mountBookmarks'

import './styles/index.css'

/*global chrome*/

class App extends React.Component {
  
  addBookmark = (folder) => {
    if (folder !== '') {
      const state = this.state
      const updateSession = this.updateSession

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        var activeTab = tabs[0];

        const lastIndex = state.bookmarks
          .filter( mark => mark.folder === folder)
          .map( mark => mark.index)
          .sort( (a,b) => a - b)[0]

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

  render() {
    return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Route exact path='/' component={BookmarksContainer} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
        </div>
      </ConnectedRouter>
    </Provider>
    )
  }
}

export default App
