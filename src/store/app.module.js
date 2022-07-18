import { PingService, PublicIpService, ConfigService, InitializeOwnlineCoreService } from '@/common/api.service'
import {
  PING_OWNLINE_CORE,
  PING_OWNLINE_WEB,
  GET_PUBLIC_IP,
  SHOW_SNACKBAR,
  FETCH_CONFIG,
  INITIALIZE_OWNLINE_CORE
} from './actions.type'

import {
  OWNLINE_CORE_PING_START,
  OWNLINE_CORE_PING_END,
  SET_PUBLIC_IP,
  ACTIVATE_SNACKBAR,
  DARK_MODE_TOGGLE,
  FETCH_CONFIG_FINISHED,
  OWNLINE_WEB_PING_END,
  OWNLINE_WEB_PING_START
} from './mutations.type'

const initialState = {
  dark: false,
  ownlineCoreState: false,
  ownlineCoreStateLoading: false,
  ownlineWebState: false,
  ownlineWebStateLoading: false,
  ownlineCoreStateTime: 0,
  publicIp: '',
  hostName: '',
  invitationUrl: '',
  snackbar: {
    active: false,
    content: 'Hello from snackbar!!',
    color: 'info',
    timeout: -1,
    multiline: false
  }
}

export const state = Object.assign({}, initialState)

export const actions = {
  [PING_OWNLINE_CORE] (context) {
    context.commit(OWNLINE_CORE_PING_START)
    return PingService.pingCore()
      .then(({ data }) => {
        context.commit(OWNLINE_CORE_PING_END, data)
        const snackbarData = {
          content: `ownline-core answers ping in: ${data.time}ms`,
          color: 'success',
          timeout: 3000
        }
        context.dispatch(SHOW_SNACKBAR, snackbarData)
      })
      .catch((error) => {
        // const snackbarData = {
        //   content: 'No connection to ownline-core',
        //   color: 'error',
        //   timeout: 3000
        // }
        // context.dispatch(SHOW_SNACKBAR, snackbarData)
        console.log(error)
        context.commit(OWNLINE_CORE_PING_END, false)
      })
  },
  [PING_OWNLINE_WEB] (context) {
    context.commit(OWNLINE_WEB_PING_START)
    return PingService.pingWeb()
      .then(({ data }) => {
        context.commit(OWNLINE_WEB_PING_END, data)
      })
      .catch(() => {
        context.commit(OWNLINE_WEB_PING_END, false)
      })
  },
  [GET_PUBLIC_IP] (context) {
    return PublicIpService.get()
      .then(({ data }) => {
        context.commit(SET_PUBLIC_IP, data)
      })
  },
  [SHOW_SNACKBAR] (context, data) {
    context.commit(ACTIVATE_SNACKBAR, data)
  },
  [FETCH_CONFIG] (context) {
    return ConfigService.get()
      .then(({ data }) => {
        context.commit(FETCH_CONFIG_FINISHED, data)
      })
      .catch(() => {
        context.commit(OWNLINE_CORE_PING_END, false)
      })
  },
  [INITIALIZE_OWNLINE_CORE] (context) {
    return InitializeOwnlineCoreService.post()
      .then(({ data }) => {
        const snackbarData = {
          content: `Initialize ownline-core: ok=${data.ok} message=${data.msg}`,
          color: data.ok ? 'success' : 'error',
          timeout: 5000
        }
        context.dispatch(SHOW_SNACKBAR, snackbarData)
      })
      .catch(() => {
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [OWNLINE_CORE_PING_START] (state) {
    state.ownlineCoreStateLoading = true
  },
  [OWNLINE_CORE_PING_END] (state, data) {
    if (data && data.ok) {
      state.ownlineCoreState = data.ok
      state.ownlineCoreStateTime = data.time
      state.ownlineCoreStateLoading = false
    } else {
      state.ownlineCoreState = false
      state.ownlineCoreStateTime = 0
      state.ownlineCoreStateLoading = false
    }
  },
  [OWNLINE_WEB_PING_START] (state) {
    state.ownlineWebStateLoading = true
  },
  [OWNLINE_WEB_PING_END] (state, data) {
    if (data) {
      state.ownlineWebState = data.ok
      state.ownlineWebStateLoading = false
    } else {
      state.ownlineWebState = false
      state.ownlineWebStateLoading = false
    }
  },
  [SET_PUBLIC_IP] (state, data) {
    state.publicIp = data.public_ip
  },
  [ACTIVATE_SNACKBAR] (state, data) {
    state.snackbar = Object.assign({}, initialState.snackbar, data)
    state.snackbar.active = true
  },
  [DARK_MODE_TOGGLE] (state) {
    state.dark = !state.dark
  },
  [FETCH_CONFIG_FINISHED] (state, data) {
    state.hostName = data.config.host_name
    state.invitationUrl = data.config.invitation_url
  }
}

const getters = {
  dark (state) {
    return state.dark
  },
  ownlineCoreState (state) {
    return state.ownlineCoreState
  },
  ownlineCoreStateLoading (state) {
    return state.ownlineCoreStateLoading
  },
  ownlineCoreStateTime (state) {
    return state.ownlineCoreStateTime
  },
  ownlineWebState (state) {
    return state.ownlineWebState
  },
  ownlineWebStateLoading (state) {
    return state.ownlineWebStateLoading
  },
  publicIp (state) {
    return state.publicIp
  },
  snackbar (state) {
    return state.snackbar
  },
  hostName (state) {
    return state.hostName
  },
  invitationUrl (state) {
    return state.invitationUrl
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
