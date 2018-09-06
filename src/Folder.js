import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from './Column'
import axios from 'axios'
import apiUrl from './apiUrl'

class Folder extends React.Component {

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


    newTaskIds.forEach( (markId, index) => {
      axios.put(apiUrl + 'bookmarks/' + markId, {markId, index, finished: this.props.folders.tasks[[markId]].finished})
      .then(
        response => {
          this.props.updateSession(response.data[0], response.data[1])
        })
    })
    
  }

  render() {
    let { folders } = this.props
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      {folders.columnOrder.sort().map(columnId => {
        const column = folders.columns[columnId]
        const tasks = column.taskIds.map(taskId => folders.tasks[taskId])

        return <Column key={column.id} column={column} tasks={tasks} updateSession={this.props.updateSession} />
      })}
      </DragDropContext>
    )
  }
}

export default Folder

