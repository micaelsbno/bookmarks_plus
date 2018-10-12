const bookmarkReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SHOW_BOOKMARKS':
      return {
        ...action.bookmarks
      }
    case 'HIDE_BOOKMARKS':
      return {}
    default:
      return state
  }
}

export default bookmarkReducer