import React from  'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios'

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
`

export default class Task extends React.Component {
  
  constructor(props){
    super(props)
  }

  deleteBookmark = () => {
    axios.delete('http://localhost:2999/bookmarks/' + this.props.task.id, {})
    .then( response => {
      this.props.updateSession(response.data[0], response.data[1])
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
            <a href={this.props.task.url}>{this.props.task.content}</a>
            <div className="link__aside">
              <i className="fas fa-times" onClick={this.deleteBookmark}></i>
              <i className="fas fa-question"></i>
              <i className="fas fa-check"></i>
            </div>
          </div>
        </Container>
      )}
      </Draggable>
    )
  }
}