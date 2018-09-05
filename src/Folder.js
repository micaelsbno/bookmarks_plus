import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from './column'
import axios from 'axios'

class Folder extends React.Component {

  constructor(props) {
    super(props)
    console.log(props)
    this.state = props.folders; 
  }

  onDragEnd = result => {
    const {destination, source, draggableId } = result

    if (!destination){
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
      ) {
      return
    }
    
    const column = this.state.columns[source.droppableId]
    const newTaskIds = Array.from(column.taskIds)
    
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)

    const newColumn = {
      ...column,
      taskIds: newTaskIds
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      }
    }

    newTaskIds.forEach( (markId, index) => {
      axios.put('http://localhost:2999/bookmarks/' + markId, {markId, index} )
      .then(
        response => {
          console.log('success')
        })
    })


    this.setState(newState)
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      {this.state.columnOrder.map(columnId => {
        const column = this.state.columns[columnId]
        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId])

        return <Column key={column.id} column={column} tasks={tasks} />
      })}
      </DragDropContext>
    )
  }
}

export default Folder

