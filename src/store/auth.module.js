import { AuthService, UserService } from '@/common/api.service'
// import JwtService from '@/common/jwt.service'
import {
  LocalStorageService,
  ID_LOGGED_IN,
  ID_COOKIE_EXPIRATION_TIME
} from '@/common/localStorage.service'

import {
  LOGIN,
  LOGOUT,
  CHECK_AUTH,
  USER_INFO
} from './actions.type'

import {
  SET_AUTH,
  SET_USER,
  PURGE_AUTH,
  SET_LOGIN_ERROR
} from './mutations.type'

const state = {
  loginError: '',
  user: {},
  isAuthenticated: false
}

const getters = {
  loginError (state) {
    return state.loginError
  },
  user (state) {
    return state.user
  },
  isAuthenticated (state) {
    return state.isAuthenticated
  }
}

const actions = {
  [LOGIN] (context, credentials) {
    return new Promise((resolve) => {
      AuthService.doLogin(credentials)
        .then(({ data }) => {
          console.log('login success: ', data)
          context.commit(SET_AUTH, data)
          resolve(data)
        })
        .catch(({ response }) => {
          console.log('login error: ', response)
          context.commit(SET_LOGIN_ERROR, response ? response.data : 'error')
        })
    })
  },
  [LOGOUT] (context) {
    return new Promise((resolve) => {
      AuthService.doLogout()
        .then(({ data }) => {
          context.commit(PURGE_AUTH)
          resolve(data)
        })
        .catch(({ response }) => {
          context.commit(PURGE_AUTH, response.msg)
          context.commit(SET_LOGIN_ERROR, response.msg)
        })
    })
  },
  [CHECK_AUTH] (context) {
    if (!LocalStorageService.getBoolean(ID_LOGGED_IN)) {
      context.commit(PURGE_AUTH)
    }
    // ApiService.get('user')
    //   .then(({data}) => {
    //     context.commit(SET_USER, data.user)
    //   })
    //   .catch((error) => {
    //     context.commit(PURGE_AUTH, error)
    //     // reject('login')
    //   })
  },
  [USER_INFO] (context) {
    return UserService.get()
      .then(({ data }) => {
        context.commit(SET_USER, data.user)
      })
  }
}

const mutations = {
  [SET_LOGIN_ERROR] (state, error) {
    state.loginError = error
  },
  [SET_AUTH] (state, data) {
    console.log('data from login', data)
    state.isAuthenticated = true
    state.loginError = ''
    LocalStorageService.set(ID_LOGGED_IN, true)
    const expiredAt = Date.now() + (data.maxAge * 1000)
    LocalStorageService.set(ID_COOKIE_EXPIRATION_TIME, expiredAt)
  },
  [SET_USER] (state, user) {
    state.user.name = user.name
    state.user.avatar = user.avatar
  },
  [PURGE_AUTH] (state) {
    state.isAuthenticated = false
    state.user = {}
    LocalStorageService.remove(ID_LOGGED_IN)
    LocalStorageService.remove(ID_COOKIE_EXPIRATION_TIME)
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
