import React from 'react'
import axios from 'axios'

class Login extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      bookmarks: []
    }
  }

  logInUser = (event) => {
    event.preventDefault()
    const {email, password} = this.state
    axios.post('http://localhost:2999/sessions', { email, password })
    .then(
      (response)  => {
        if (response[0] !== 'error') {
          this.props.updateSession(response.data[0], response.data[1], response.data[2])
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
          <h1>Login</h1>
          <form onSubmit={this.logInUser} action='/'method='post'>
            <input type='text' name='email' onChange={this.update} />
            <input type='text' name='password' onChange={this.update} />
            <button>Send</button>
          </form>
        </div>
      ) 
    }
}

export default Login