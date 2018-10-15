import React from 'react'
import axios from 'axios'
import '../styles/Login.css'
import apiUrl from '../helpers/apiUrl'
import mountBookmarks from '../helpers/mountBookmarks'

import { history } from '../store'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as bookmarkActions from '../actions/bookmarkActions'
import * as userActions from '../actions/userActions'

class Login extends React.Component{

  storeSession = (token, userId, bookmarks) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }

  userHasSession = () => {
    return !!localStorage.getItem('token')
  }

  isUserLoggedIn = () => !!this.props.user.token
  userHasBookmarks = () => !!this.props.bookmarks.bookmarks

  goToBookmarks = () => {
    history.push('/', {bookmarks: this.props.bookmarks, user: this.props.user})
  }

  logInUser = (event) => {
    event.preventDefault()
    const email = this.refs.email.value
    const password = this.refs.password.value
    this.loginRequest(email, password)
  }

  loginRequest = (email, password) => {
    axios.post(apiUrl + 'sessions', { email, password })
    .then((response) => {
      if (response.data[0] !== 'error') {          
        let token = response.data[0]
        let bookmarks = mountBookmarks(response.data[1])
        let userId = response.data[2]
        this.storeSession(token, userId, bookmarks)
        this.props.showBookmarks(bookmarks)
        this.props.login(token, userId)
        history.push('/')
      } else {
        localStorage.clear()
        console.log('wrong password')
      }
    })
  }

  loginFromLocalStorage = () => {
    return <div>
      {this.props.showBookmarks(JSON.parse(localStorage.getItem('bookmarks')))}
      {this.props.login(localStorage.getItem('token'), localStorage.getItem('userId'))}
      {history.push('/')}
    </div> 
  }

  componentWillMount = () => {
    if (this.isUserLoggedIn() && this.userHasBookmarks()) {
      return (<div>{history.push('/', {bookmarks: this.props.bookmarks, user: this.props.user})}</div>)
    } else if (this.userHasSession()) {
        return this.loginFromLocalStorage()
    } else {
      this.render()
    }
  }

  render() {
      return (
        <div>
          <h1 className='login__title' style={{marginTop: 2 + 'em'}}>Login</h1>
          <form className='login__form' onSubmit={this.logInUser} action='/'method='post'>
            <input ref='email' className='login__input'  type='text' placeholder='email' name='email' />
            <input ref='password' className='login__input' type='password' placeholder='password' name='password' />
            <button>Send</button>
          </form>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
        