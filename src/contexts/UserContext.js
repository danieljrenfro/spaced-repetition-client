import React, { Component } from 'react'
import AuthApiService from '../services/auth-api-service'
import TokenService from '../services/token-service'
import IdleService from '../services/idle-service'

// A variable that stores the context for a User.
const UserContext = React.createContext({
  // this context stores... 
  // ...the user object
  user: {},
  // ...any errors related to the user
  error: null,
  // ...the function to set an Error
  setError: () => {},
  // ...the function to clear an Error
  clearError: () => {},
  // ...the function to set a User
  setUser: () => {},
  // ...the function to process a user logging in
  processLogin: () => {},
  // ...the function to process a user logging out
  processLogout: () => {},
})
// export the UserContext
export default UserContext
  
// React Class Component titled UserProvider
export class UserProvider extends Component {
  constructor(props) {
    super(props)
    // the state stores the user object and any error
    const state = { user: {}, error: null }

    // stores the parsed Authentication Token from the API.
    const jwtPayload = TokenService.parseAuthToken()

    // if there is a valid jwt it assigns the values to the user object
    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      }

    // updates the state with the updated state w/ user info
    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle)
  }

  // on the component mounting it checks if a user has an auth token
  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      // if they do, set the event listeners for different user actions
      IdleService.registerIdleTimerResets()
      // before the expiry time is reached you execute a function, in this case it's to refresh the token
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken()
      })
    }
  }

  // when the componenet unmounts...
  componentWillUnmount() {
    // remove the idle reset event listeners
    IdleService.unRegisterIdleResets()
    // clear the timeout
    TokenService.clearCallbackBeforeExpiry()
  }

  // sets the value of the error on state
  setError = error => {
    console.error(error)
    this.setState({ error })
  }

  // resets error on state back to null
  clearError = () => {
    this.setState({ error: null })
  }

  // given a user, it setsState of user to that user
  setUser = user => {
    this.setState({ user })
  }

  // given an authToken
  processLogin = authToken => {
    // saves the auth token
    TokenService.saveAuthToken(authToken)
    // parses the auth token and assigns it to jwtPayload
    const jwtPayload = TokenService.parseAuthToken()
    // sets the user to state
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    })
    // registers event listeners
    IdleService.registerIdleTimerResets()
    // this is queuing a callback function to execute before the expiry time. We are queueing the refresh the token
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken()
    })
  }

  processLogout = () => {
    // clear the auth token
    TokenService.clearAuthToken()
    // clear the the callback set to execute before the expiry
    TokenService.clearCallbackBeforeExpiry()
    // unregister all event listeners
    IdleService.unRegisterIdleResets()
    // set the user back to empty object
    this.setUser({})
  }

  // when a user has been idle, log them out
  logoutBecauseIdle = () => {
    // clear the auth token
    TokenService.clearAuthToken()
    // clear the callback function set to execute before expiry
    TokenService.clearCallbackBeforeExpiry()
    // unregister all event listeners
    IdleService.unRegisterIdleResets()
    // set user the user to being idle instead of true user.
    this.setUser({ idle: true })
  }


  fetchRefreshToken = () => {
    // do API call to refresh the token
    AuthApiService.refreshToken()
      .then(res => {
        // save the new auth token
        TokenService.saveAuthToken(res.authToken)
        // queue a callback function before expiry
        TokenService.queueCallbackBeforeExpiry(() => {
          // queuing fetchRefreshToken
          this.fetchRefreshToken()
        })
      })
      // if error, setError
      .catch(err => {
        this.setError(err)
      })
  }

  render() {
    // pass all public facing values and function into the UserContext.Provider
    const value = {
      user: this.state.user,
      error: this.state.error,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
    }
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}
