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

    return newState

  } else {
    return state
  }
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
    default:
      return state
  }
}

export default bookmarkReducer