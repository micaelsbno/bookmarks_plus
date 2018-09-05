import React from 'react'
import styled from 'styled-components'
import Task from './Task'
import { Droppable } from 'react-beautiful-dnd'

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  background-color: white;
`
const Title = styled.h3`
  padding: 8px;
`
const TaskList = styled.div`
  padding: 8px;
`

export default class Column extends React.Component {
  render(){
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
        {(provided) => (
          <TaskList
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
        {/*sort this by index from the database*/}
            {this.props.tasks.map((task,index) => (
              <Task key={task.id} task={task} index={index} updateSession={this.props.updateSession} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
        </Droppable>
      </Container>
    )
  }
}