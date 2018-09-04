import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

const onDragEnd = result => {
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
    this.setState(newState)
  }

  export default onDragEnd