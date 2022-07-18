import Vue from 'vue'
import { ServicesService } from '@/common/api.service'
import {
  FETCH_SERVICES,
  SHOW_SERVICE_DIALOG,
  HIDE_SERVICE_DIALOG,
  UPDATE_SERVICE_CONFIG
} from './actions.type'
import {
  SERVICES_FETCH_START,
  SERVICES_FETCH_END,
  RESET_SERVICES_STATE,
  SET_SERVICE_DIALOG,
  SET_SERVICE_CONFIG
} from './mutations.type'

const initialState = {
  services: [],
  servicesLoading: true,
  servicesCount: 0,
  serviceDialog: {
    active: false,
    service: {}
  }
}

export const state = Object.assign({}, initialState)

export const actions = {
  [FETCH_SERVICES] (context, articleSlug) {
    context.commit(SERVICES_FETCH_START)
    return ServicesService.get(articleSlug)
      .then(({ data }) => {
        context.commit(SERVICES_FETCH_END, data.services)
      })
  },
  [SHOW_SERVICE_DIALOG] (context, data) {
    context.commit(SET_SERVICE_DIALOG, data)
  },
  [HIDE_SERVICE_DIALOG] (context) {
    context.commit(SET_SERVICE_DIALOG, false)
  },
  [UPDATE_SERVICE_CONFIG] (context, data) {
    return ServicesService.post(data)
      .then(({ data }) => {
        context.commit(SET_SERVICE_CONFIG, data)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [SERVICES_FETCH_START] (state) {
    state.servicesLoading = true
  },
  [SERVICES_FETCH_END] (state, services) {
    state.services = services
    state.servicesCount = services.length
    state.servicesLoading = false
  },
  [RESET_SERVICES_STATE] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [SET_SERVICE_DIALOG] (state, data) {
    console.log('serviceDialog: ', data)
    if (data) {
      state.serviceDialog = Object.assign({}, initialState.serviceDialog, data)
      state.serviceDialog.active = true
    } else {
      state.serviceDialog.active = false
    }
  },
  [SET_SERVICE_CONFIG] (state, data) {
    // state.services[data.service.id] = data
  }
}

const getters = {
  services (state) {
    return state.services
  },
  servicesSelectList (state) {
    return state.services.map(function (item) {
      return {
        name: item.name,
        image: item.image,
        public_id: item.public_id
      }
    })
  },
  serviceById: (state) => (publicId) => {
    const servicesList = state.services.filter(function (service) {
      return service.public_id === publicId
    })
    if (servicesList.length > 1 || servicesList.length < 1) {
      return undefined
    } else if (servicesList.length === 1) {
      return servicesList[0]
    }
  },
  servicesCount (state) {
    return state.servicesCount
  },
  servicesLoading (state) {
    return state.servicesLoading
  },
  serviceDialog (state) {
    return state.serviceDialog
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
