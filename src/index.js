import React from 'react'
import ReactDOM from 'react-dom';
import Login from './Login'
import Signup from './Signup'
import Bookmarks from './Bookmarks'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      bookmarks: [],
      page: 'login'
    }
  }

  updateSession = (token, bookmarks) => {
    this.setState({ token, bookmarks })
  }

  userIsLoggedIn = () => {
    return this.state.token === 'token'
  }
  
  goTo (link) {
    this.setState({
      page: link
    })
  }

  render() {
    if (this.userIsLoggedIn()) {
      return (
        <Bookmarks bookmarks={this.state.bookmarks}/>
      )
    } else if (this.state.page === 'login') {   
      return (
        <div>
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
