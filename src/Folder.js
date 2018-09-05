import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from './column'
import axios from 'axios'

class Folder extends React.Component {

  constructor(props) {
    super(props)
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
    
    const column = this.props.folders.columns[source.droppableId]
    const newTaskIds = Array.from(column.taskIds)
    
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)

    const newColumn = {
      ...column,
      taskIds: newTaskIds
    }

    const newState = {
      ...this.props.folders,
      columns: {
        ...this.props.folders.columns,
        [newColumn.id]: newColumn,
      }
    }

    newTaskIds.forEach( (markId, index) => {
      axios.put('http://localhost:2999/bookmarks/' + markId, {markId, index} )
      .then(
        response => {
          console.log('success')
          this.props.updateSession(response.data[0], response.data[1])
        })
    })
    
  }

  render() {
    let { folders } = this.props
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      {folders.columnOrder.map(columnId => {
        const column = folders.columns[columnId]
        const tasks = column.taskIds.map(taskId => folders.tasks[taskId])

        return <Column key={column.id} column={column} tasks={tasks} updateSession={this.props.updateSession} />
      })}
      </DragDropContext>
    )
  }
}

export default Folder

