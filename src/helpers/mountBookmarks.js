const mountBookmarks = (data) => {
    const allBookmarks = {bookmarks: {}, folderOrder: [], folders: {}}

    // this creates folder order
    data.forEach( bookmark => {
      !allBookmarks.folderOrder.includes(bookmark.folder) &&
      allBookmarks.folderOrder.push(bookmark.folder)
    })

    // this creates bookmarks order
    allBookmarks.folderOrder.forEach( bookmark => {
      allBookmarks.folders[bookmark] = {
        id: bookmark,
        title: bookmark,
        bookmarkIds: data
          .sort((markA, markB) => markA.index - markB.index)
          .filter( mark => mark.folder === bookmark )
          .map( mark => mark.id)
      }
    })

    // this creates bookmarks
    data.forEach( bookmark => {
      allBookmarks.bookmarks[bookmark.id] = {
        id: bookmark.id,
        content: bookmark.title,
        url: bookmark.url,
        finished: bookmark.finished
      }
    })
    return allBookmarks
  }

  export default mountBookmarks