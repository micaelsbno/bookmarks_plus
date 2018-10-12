const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        token: action.token,
        userId: action.userId
    }
    case 'LOGOUT':
    return {
      userId: null,
      token: null
    }
    default:
      return state
  }
}

export default userReducer