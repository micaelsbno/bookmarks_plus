import React from 'react'
import axios from 'axios'

export default class Signup extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      bookmarks: []
    }
  }

  update = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  createAccount = (event) => {
    event.preventDefault()
    const {email, password} = this.state
    axios.post('http://localhost:2999/users', { email, password })
    .then(
      (response)  => {
        if (!!response[0] != 'error') {
          this.props.updateSession(response.data[0], response.data[1])
        }
      }    
    )
  }
  
  render() {
    return (
     <div>
      <h1>Signup</h1>
      <form onSubmit={this.createAccount} action='/users'method='post'>
        <input type='text' name='email' onChange={this.update} />
        <input type='text' name='password' onChange={this.update} />
        <button>Send</button>
      </form>
    </div>
    )
  }
}