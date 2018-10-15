import axios from 'axios'
import apiUrl from '../helpers/apiUrl'

const moveBookmark = (state = {}, action) => {
  if (action.type === 'DRAG_BOOKMARK') {
    const { destination, source, draggableId } = action.result
    const { bookmarks, folders } = state
    
    if (!destination){
      return state
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
      ) {
      return state
    }

    const folder = folders[source.droppableId]
    const newBookmarkIds = Array.from(folder.bookmarkIds)
    
    newBookmarkIds.splice(source.index, 1)
    newBookmarkIds.splice(destination.index, 0, draggableId)

    const newFolder = {
      ...folder,
      bookmarkIds: newBookmarkIds
    }

    const newState = {
      ...state,
      folders: {
        ...folders,
        [newFolder.id]: newFolder,
      }
    }

    newBookmarkIds.forEach( (markId, index) => {
      axios.put(apiUrl + 'bookmarks/' + markId, { markId, index, finished: bookmarks[[markId]].finished})
      .then(response => {console.log('changed')})})

    localStorage.setItem('bookmarks', JSON.stringify(newState))
    return newState

  } else {
    return state
  }
}

const toggleFinished = (state = {}, action) => {
    let toggler = action.finished === 'finished' ? false : true
    axios.put(apiUrl + '/bookmarks/' + action.id, {
      id: action.id,
      index: state.bookmarks[action.id].index, 
      finished: toggler
    })
    .then(response => {console.log('toggled')})

  let newState = {
    ...state, 
    bookmarks: {
      ...state.bookmarks,
      [action.id]: {
        ...state.bookmarks[action.id],
        finished: toggler
      }
    }
  }
  localStorage.setItem('bookmarks', JSON.stringify(newState))
  return newState
}

const deleteBookmark = (state = {}, action) => {
  axios.delete(apiUrl + 'bookmarks/' + action.id)
  .then(response => {console.log('deleted')})
   
  let newState = {...state}
  delete newState.bookmarks[action.id]
  let folderId = action.folder.id
  newState = {...newState,
    folders: {
      ...newState.folders,
      [folderId]: {
        ...newState.folders[folderId],
          bookmarkIds: newState.folders[folderId].bookmarkIds.filter(id => id !== action.id )
      }
    }
  }
  localStorage.setItem('bookmarks', JSON.stringify(newState))
  return newState
}

const addBookmark = (state = {}, action) => {
  console.log('add bookmark')  
}

const bookmarkReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SHOW_BOOKMARKS':
      return {
        ...action.bookmarks
      }
    case 'HIDE_BOOKMARKS':
      return {}
    case 'DRAG_BOOKMARK':
      return (moveBookmark(state, action))
    case 'TOGGLE_FINISHED':
      return (toggleFinished(state, action))
    case 'DELETE_BOOKMARK':
      return (deleteBookmark(state, action))
    case 'ADD_BOOKMARK':
      return (addBookmark(state, action))
    default:
      return state
  }
}

export default bookmarkReducer