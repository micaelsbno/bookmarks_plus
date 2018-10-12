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