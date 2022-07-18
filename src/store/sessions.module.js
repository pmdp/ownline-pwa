import Vue from 'vue'
import { SessionsService } from '@/common/api.service'
import {
  FETCH_SESSIONS,
  SESSION_REQUEST,
  SHOW_SESSION_DIALOG,
  HIDE_SESSION_DIALOG,
  CHECK_EXPIRED,
  DELETE_SESSION,
  FLUSH_ALL_SESSIONS, SHOW_SNACKBAR
} from './actions.type'
import {
  SESSIONS_FETCH_START,
  SESSIONS_FETCH_END,
  RESET_SESSIONS_STATE,
  SESSION_REQUEST_START,
  SESSION_REQUEST_END,
  SET_SESSION_DIALOG
} from './mutations.type'

const initialState = {
  activeSessions: [],
  historySessions: [],
  activeSessionsLoading: true,
  historySessionsLoading: true,
  activeSessionsCount: 0,
  historySessionsCount: 0,
  sessionRequestLoading: false,
  sessionDialog: {
    active: false,
    title: '',
    service_img: '',
    service_name: '',
    service_protocol: '',
    service_path: '',
    session: {}
  }
}

export const state = Object.assign({}, initialState)

export const actions = {
  [FETCH_SESSIONS] (context, active) {
    context.commit(SESSIONS_FETCH_START, active)
    return SessionsService.get(active)
      .then(({ data }) => {
        context.commit(SESSIONS_FETCH_END, { active: active, sessions: data.sessions })
      })
  },
  [SESSION_REQUEST] (context, request) {
    context.commit(SESSION_REQUEST_START)
    return SessionsService.post(request)
      .then(({ data }) => {
        context.commit(SESSION_REQUEST_END, data)
        context.dispatch(FETCH_SESSIONS, true)
      }).catch((error) => {
        console.log('session request error: ', error)
        const data = {
          content: `Session request failed: ok=${error.response.data.ok} message=${error.response.data.msg}`,
          color: 'error'
        }
        context.dispatch(SHOW_SNACKBAR, data)
      })
  },
  [DELETE_SESSION] (context, request) {
    return SessionsService.destroy(request)
      .then(({ data }) => {
        context.dispatch(FETCH_SESSIONS, true)
        const snackbarData = {
          content: 'Session deleted OK',
          color: 'success',
          timeout: 2000
        }
        context.dispatch(SHOW_SNACKBAR, snackbarData)
      }).catch((error) => {
        console.log('session request error: ', error)
        const snackbarData = {
          content: `Session deleted FAILED: ${error}`,
          color: 'error',
          timeout: 5000
        }
        context.dispatch(SHOW_SNACKBAR, snackbarData)
        // context.commit(SESSION_REQUEST_END, data)
      })
  },
  [SHOW_SESSION_DIALOG] (context, data) {
    context.commit(SET_SESSION_DIALOG, data)
  },
  [HIDE_SESSION_DIALOG] (context) {
    context.commit(SET_SESSION_DIALOG, false)
  },
  [CHECK_EXPIRED] (context) {
    SessionsService.checkExpired()
      .then(({ data }) => {
        console.log('successfully checked for expired sessions')
      }).catch((error) => {
        console.log('error checking expired sessions: ', error)
      })
  },
  [FLUSH_ALL_SESSIONS] (context) {
    SessionsService.flushAll()
      .then(({ data }) => {
        console.log('successfully flushed all sessions')
        const snackbarData = {
          content: 'Flushed all sessions OK',
          color: 'success',
          timeout: 3000
        }
        context.dispatch(SHOW_SNACKBAR, snackbarData)
      }).catch((error) => {
        console.log('error flushing all sessions: ', error)
        const snackbarData = {
          content: 'Flushed all sessions BAD',
          color: 'error',
          timeout: 3000
        }
        context.dispatch(SHOW_SNACKBAR, snackbarData)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SESSIONS_FETCH_START] (state, active) {
    if (active) {
      state.activeSessionsLoading = true
    } else {
      state.historySessionsLoading = true
    }
  },
  [SESSIONS_FETCH_END] (state, response) {
    if (response.active) {
      state.activeSessions = response.sessions
      state.activeSessionsLoading = false
      state.activeSessionsCount = response.sessions.length
    } else {
      state.historySessions = response.sessions
      state.historySessionsLoading = false
      state.historySessionsCount = response.sessions.length
    }
  },
  [RESET_SESSIONS_STATE] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [SESSION_REQUEST_START] () {
    state.sessionRequestLoading = true
  },
  [SESSION_REQUEST_END] (state, data) {
    state.sessionRequestLoading = false
  },
  [SET_SESSION_DIALOG] (state, data) {
    console.log('sessionDialog: ', data)
    if (data) {
      state.sessionDialog = Object.assign({}, initialState.sessionDialog, data)
      state.sessionDialog.active = true
    } else {
      state.sessionDialog.active = false
    }
  }
}

const getters = {
  activeSessions (state) {
    return state.activeSessions
  },
  activeSessionsCount (state) {
    return state.activeSessionsCount
  },
  activeSessionsLoading (state) {
    return state.activeSessionsLoading
  },
  historySessions (state) {
    return state.historySessions
  },
  historySessionsCount (state) {
    return state.historySessionsCount
  },
  historySessionsLoading (state) {
    return state.historySessionsLoading
  },
  sessionDialog (state) {
    return state.sessionDialog
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
