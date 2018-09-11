import React from  'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios'
import './Task.css'
import apiUrl from './apiUrl'

const Container = styled.div`
  padding: 8px;
  padding-left: 1em;
  margin-bottom: 0.5em;
  transition: all 0.3s ease;
  border-radius: 0.3em;
  &:hover ${Container}{
    background-color: #F7F7F7;
  }
`

export default class Task extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.props
  }

  deleteBookmark = () => {
    axios.delete(apiUrl + 'bookmarks/' + this.props.task.id)
    .then( response => {
      // this.props.updateSession(response.data[0], response.data[1])
    })
    // let thisprops = this.props
    this.props.deleteItem(this.props.task.id)
  }

  isLinkFinished = () => {
    if (this.state.task.finished) {
      return 'finished'
    }
  }

  isIconFinished = () => {
    if (this.state.task.finished) {
     return'fas fa-check finished'
    } else {
      return 'fas fa-check'
    }
  }

  toggleFinished = () => {
    let state = this.state.task
    const toggler = this.state.task.finished ? false : true
    axios.put(apiUrl + '/bookmarks/' + this.props.task.id, {id: this.props.task.id,index: this.props.index, finished: toggler} )
      .then(
        response => {
          // this.props.updateSession(response.data[0], response.data[1], response.data[2])
      })
    
    state.finished = toggler

    this.setState(state)
    
  }
  
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
      { (provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <div className='link__container'>
            <a href={this.state.task.url} target="_blank" className={this.isLinkFinished()} >{this.state.task.content}</a>
            <div className="link__aside">
              <i className="fas fa-times"  onClick={this.deleteBookmark}></i>
              <i className="fas fa-question"></i>
              <i className={this.isIconFinished()} onClick={this.toggleFinished} ></i>
            </div>
          </div>
        </Container>
      )}
      </Draggable>
    )
  }
}