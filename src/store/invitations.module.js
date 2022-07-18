import Vue from 'vue'
import { InvitationsService } from '@/common/api.service'
import {
  FETCH_INVITATIONS,
  CREATE_INVITATION,
  SHOW_CREATE_INVITATION_DIALOG,
  HIDE_CREATE_INVITATION_DIALOG,
  SHOW_INVITATION_DIALOG,
  HIDE_INVITATION_DIALOG,
  CHECK_EXPIRED,
  DELETE_INVITATION,
  FLUSH_ALL_INVITATIONS
} from './actions.type'
import {
  INVITATIONS_FETCH_START,
  INVITATIONS_FETCH_END,
  RESET_INVITATIONS_STATE,
  CREATE_INVITATION_START,
  CREATE_INVITATION_END,
  CREATE_INVITATION_ERROR,
  SET_CREATE_INVITATION_DIALOG,
  SET_INVITATION_DIALOG
} from './mutations.type'

const initialState = {
  activeInvitations: [],
  historyInvitations: [],
  activeInvitationsLoading: true,
  historyInvitationsLoading: true,
  activeInvitationsCount: 0,
  historyInvitationsCount: 0,
  invitationRequestLoading: false,
  invitationRequestError: {},
  createInvitationDialog: {
    active: false,
    title: '',
    service_img: '',
    service_name: '',
    service_protocol: '',
    invitation: {}
  },
  invitationDialog: {
    active: false,
    title: '',
    service_img: '',
    service_name: '',
    service_protocol: '',
    invitation: {}
  }
}

export const state = Object.assign({}, initialState)

export const actions = {
  [FETCH_INVITATIONS] (context, active) {
    context.commit(INVITATIONS_FETCH_START, active)
    return InvitationsService.get(active)
      .then(({ data }) => {
        context.commit(INVITATIONS_FETCH_END, { active: active, invitations: data.invitations })
      })
  },
  [CREATE_INVITATION] (context, request) {
    context.commit(CREATE_INVITATION_START)
    return InvitationsService.post(request)
      .then(({ data }) => {
        context.commit(CREATE_INVITATION_END, data)
        context.dispatch(FETCH_INVITATIONS, true)
      }).catch((error) => {
        console.log('invitation request error: ', error)
        context.commit(CREATE_INVITATION_ERROR, error)
        // context.commit(CREATE_INVITATION_END, data)
      })
  },
  [DELETE_INVITATION] (context, request) {
    return InvitationsService.destroy(request)
      .then(({ data }) => {
        context.dispatch(FETCH_INVITATIONS, true)
      }).catch((error) => {
        console.log('invitation request error: ', error)
        context.commit(CREATE_INVITATION_ERROR, error)
        // context.commit(CREATE_INVITATION_END, data)
      })
  },
  [SHOW_CREATE_INVITATION_DIALOG] (context, data) {
    context.commit(SET_CREATE_INVITATION_DIALOG, data)
  },
  [HIDE_CREATE_INVITATION_DIALOG] (context) {
    context.commit(SET_CREATE_INVITATION_DIALOG, false)
  },
  [SHOW_INVITATION_DIALOG] (context, data) {
    context.commit(SET_INVITATION_DIALOG, data)
  },
  [HIDE_INVITATION_DIALOG] (context) {
    context.commit(SET_INVITATION_DIALOG, false)
  },
  [CHECK_EXPIRED] (context) {
    InvitationsService.checkExpired()
      .then(({ data }) => {
        console.log('successfully checked for expired invitations')
      }).catch((error) => {
        console.log('error checking expired invitations: ', error)
      })
  },
  [FLUSH_ALL_INVITATIONS] (context) {
    InvitationsService.flushAll()
      .then(({ data }) => {
        console.log('successfully flushed all invitations')
      }).catch((error) => {
        console.log('error flushing all invitations: ', error)
      })
  }
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
  [INVITATIONS_FETCH_START] (state, active) {
    if (active) {
      state.activeInvitationsLoading = true
    } else {
      state.historyInvitationsLoading = true
    }
  },
  [INVITATIONS_FETCH_END] (state, response) {
    if (response.active) {
      state.activeInvitations = response.invitations
      state.activeInvitationsLoading = false
      state.activeInvitationsCount = response.invitations.length
    } else {
      state.historyInvitations = response.invitations
      state.historyInvitationsLoading = false
      state.historyInvitationsCount = response.invitations.length
    }
  },
  [RESET_INVITATIONS_STATE] () {
    for (const f in state) {
      Vue.set(state, f, initialState[f])
    }
  },
  [CREATE_INVITATION_START] () {
    state.invitationRequestLoading = true
  },
  [CREATE_INVITATION_END] (state, data) {
    state.invitationRequestLoading = false
  },
  [CREATE_INVITATION_ERROR] (state, data) {
    state.invitationRequestError = data
  },
  [SET_CREATE_INVITATION_DIALOG] (state, data) {
    console.log('createInvitationDialog: ', data)
    if (data) {
      state.createInvitationDialog = Object.assign({}, initialState.createInvitationDialog, data)
      state.createInvitationDialog.active = true
    } else {
      state.createInvitationDialog.active = false
    }
  },
  [SET_INVITATION_DIALOG] (state, data) {
    console.log('invitationDialog: ', data)
    if (data) {
      state.invitationDialog = Object.assign({}, initialState.invitationDialog, data)
      state.invitationDialog.active = true
    } else {
      state.invitationDialog.active = false
    }
  }
}

const getters = {
  activeInvitations (state) {
    return state.activeInvitations
  },
  activeInvitationsCount (state) {
    return state.activeInvitationsCount
  },
  activeInvitationsLoading (state) {
    return state.activeInvitationsLoading
  },
  historyInvitations (state) {
    return state.historyInvitations
  },
  historyInvitationsCount (state) {
    return state.historyInvitationsCount
  },
  historyInvitationsLoading (state) {
    return state.historyInvitationsLoading
  },
  invitationRequestError (state) {
    return state.invitationRequestError
  },
  createInvitationDialog (state) {
    return state.createInvitationDialog
  },
  invitationDialog (state) {
    return state.invitationDialog
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
