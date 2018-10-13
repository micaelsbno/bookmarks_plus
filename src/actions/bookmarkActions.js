export const showBookmarks = (bookmarks) => {
  return {
    type: 'SHOW_BOOKMARKS',
    bookmarks
  }
}

export const hideBookmarks = () => {
  return {
    type: 'HIDE_BOOKMARKS'
  }
}

export const dragBookmark = (result) => {
  return {
    type: 'DRAG_BOOKMARK',
    result
  }
}

export const toggleFinished = () => {
  
}