export const login = (token, userId) => {
  return { 
    type: 'LOGIN_SUCCESS',
    token,
    userId
  }
}

export const logoutUser = () => {
  return {
    type: 'LOGOUT'
  }
}

export const signup = (username, password) => {
  return { username, password }
}