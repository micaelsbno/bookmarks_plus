import React from 'react'
import axios from 'axios'
import './Login.css'
import apiUrl from './apiUrl'
import mountBookmarks from './helpers/mountBookmarks'

class Login extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      bookmarks: []
    }
  }

  storeSession = (response) => {
    localStorage.setItem('email', this.state.email)
    localStorage.setItem('password', this.state.password)
  }

  logInUser = (event) => {
    event.preventDefault()
    const {email, password} = this.state
    axios.post(apiUrl + 'sessions', { email, password })
    .then(
      (response) => {
        if (response[0] !== 'error') {
          let folders = mountBookmarks(response.data[1])
          this.props.updateSession(response.data[0], folders, response.data[2], 'hidden', [])
          this.storeSession()
        }
      }    
    )
  }
  
  update = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  render(){
     return (
        <div>
          <h1 className='login__title' style={{marginTop: 2 + 'em'}}>Login</h1>
          <form className='login__form' onSubmit={this.logInUser} action='/'method='post'>
            <input className='login__input' type='text' placeholder='email' name='email' onChange={this.update} />
            <input className='login__input' type='password' placeholder='password' name='password' onChange={this.update} />
            <button>Send</button>
          </form>
        </div>
      ) 
    }
}

export default Login