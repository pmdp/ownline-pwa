import Vue from 'vue'
import Vuex from 'vuex'

import service from './services.module'
import session from './sessions.module'
import invitation from './invitations.module'
import auth from './auth.module'
import app from './app.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    service,
    session,
    invitation,
    auth
  }
})
