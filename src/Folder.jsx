import React from 'react';
import '@atlaskit/css-reset'
import { DragDropContext } from 'react-beautiful-dnd'
import Column from './Column'
import axios from 'axios'
import apiUrl from './apiUrl'

class Folder extends React.Component {
  constructor(props){
    super(props)
    this.state = this.props.folders
  }
  
  deleteColumn = (column) => {
    let oldState = this.state
    let bookmarks = this.state.tasks
    var newState = {}

    Object.keys(bookmarks).forEach( bookmark => {
      if (bookmarks[bookmark].id !== column) {
        newState[bookmarks[bookmark].id] = bookmarks[bookmark]
      }
    })

    const changeState = {...this.state, tasks: newState}
    this.setState(changeState)

  }
  
  onDragEnd = result => {
    let currentState = this.state

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
      .filter( mark => this.state.tasks[mark] !== undefined)
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)

    const newColumn = {
      ...column,
      taskIds: newTaskIds
    }

    const newState = {
      ...this.state.folders,
      columns: {
        ...this.state.columns,
        [newColumn.id]: newColumn,
      }
    }

    newTaskIds.forEach( (markId, index) => {
      axios.put(apiUrl + 'bookmarks/' + markId, {markId, index, finished: this.state.tasks[[markId]].finished})
      .then(
        response => {
          this.props.updateSession(response.data[0], response.data[1])
        })
    })

    this.setState(newState)
  }

  // componentWillMount() {
  //   this.setState(this.props.folders)
  // }

  render() {
        
    const folders = this.state

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      {folders.columnOrder.sort().map(columnId => {
        const column = folders.columns[columnId]
        const tasks = column.taskIds.map(taskId => folders.tasks[taskId])
        return <Column key={column.id} column={column} tasks={tasks} deleteColumn={this.deleteColumn} />
      })}
      </DragDropContext>
    )
  }
}

export default Folder

