import React from 'react'
import axios from 'axios'
import '../styles/Signup.css'
import apiUrl from '../helpers/apiUrl'

export default class Signup extends React.Component {

  update = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  storeSession = (response) => {
    localStorage.setItem('email', this.state.email)
    localStorage.setItem('password', this.state.password)
  }

  createAccount = (event) => {
    event.preventDefault()
    const {email, password} = this.state
    axios.post(apiUrl + 'users', { email, password })
    .then(
      (response)  => {
        if (!!response[0] !== 'error') {
          this.props.updateSession(response.data[0], response.data[1], response.data[2], 'hidden', [])
          this.storeSession()
        }
      }    
    )
  }
  
  render() {
    return (
     <div>
      <h1 style={{marginTop: 2 + 'em'}}>Signup</h1>
      <form className='signup__form' onSubmit={this.createAccount}  action='/users' method='post'>
        <input className='signup__input' placeholder='email' type='text' name='email' onChange={this.update} />
        <input className='signup__input' type='password' placeholder='password' name='password' onChange={this.update} />
        <button>Send</button>
      </form>
    </div>
    )
  }
}