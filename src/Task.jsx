import React from  'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios'
import './Task.css'

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

  deleteBookmark = () => {
    axios.delete('http://localhost:2999/bookmarks/' + this.props.task.id)
    .then( response => {
      this.props.updateSession(response.data[0], response.data[1])
    })
  }

  isLinkFinished = () => {
    if (this.props.task.finished) {
      return 'finished'
    }
  }

  isIconFinished = () => {
    if (this.props.task.finished) {
     return'fas fa-check finished'
    } else {
      return 'fas fa-check'
    }
  }

  toggleFinished = () => {
    
    const toggler = this.props.task.finished ? false : true
    axios.put('http://localhost:2999/bookmarks/' + this.props.task.id, {id: this.props.task.id,index: this.props.index, finished: toggler} )
      .then(
        response => {
          console.log(response)
          this.props.updateSession(response.data[0], response.data[1], response.data[2])
      })
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
            <a href={this.props.task.url} className={this.isLinkFinished()} >{this.props.task.content}</a>
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