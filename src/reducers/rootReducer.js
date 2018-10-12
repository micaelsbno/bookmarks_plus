import { combineReducers } from 'redux'

import userReducer from './userReducer'
import bookmarkReducer from './bookmarkReducer'

const rootReducer = combineReducers({user: userReducer, bookmarks: bookmarkReducer})

export default rootReducer