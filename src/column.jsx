import React from 'react'
import styled from 'styled-components'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd'
import './Column.css'

const Container = styled.div`
  margin: 8px;
  border-radius: 2px;
  background-color: white;
  border-bottom: 0.1em solid rgba(173,172,172,0.26);
  padding: 1em
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
`

export default class Column extends React.Component {
  
  state = this.props

  render(){
    let state = this.props
    return (
      <Container>
        <Title><div className="pointer"></div>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
        {(provided) => (
          <TaskList
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
        {/*sort this by index from the database*/}
            {this.props.tasks.filter(mark => mark !== undefined).map((task,index) => (
              <Task key={task.id} task={task} index={index} deleteItem={this.props.deleteColumn} updateSession={this.props.updateSession} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
        </Droppable>
      </Container>
    )
  }
}