import React from 'react'
import ReactDOM from 'react-dom';
import { Route, Link, Switch } from 'react-router-dom'
import Login from './Login'

class App extends React.Component {

  render() {
    return (
      <Login />
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
