import React from 'react'
import axios from 'axios'
import Bookmarks from './Bookmarks'

class Login extends React.Component{
  
  constructor(props){
    super(props)
    this.userIsLoggedIn = this.userIsLoggedIn.bind(this)
    this.state = {
      email: '',
      password: '',
      token: '',
      bookmarks: []
    }
  }

  logInUser = (event) => {
    event.preventDefault()
    const {email, password} = this.state
    axios.post('http://localhost:2999/sessions', { email, password })
    .then(
      (response)  => {
        if (!!response[0] != 'error') {
          this.setState({
            token: response.data[0],
            bookmarks: response.data[1]
          })
        }
      }    
    )
  }
  
  userIsLoggedIn(){
    return this.state.token === 'token'
  }


  update = (event) => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  render(){
    if (this.userIsLoggedIn()) {
      return (
          <Bookmarks bookmarks={this.state.bookmarks}/>
        )
    } else {   
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
}

export default Login