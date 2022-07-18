import Vue from 'vue'
// import JwtService from '@/common/jwt.service'

const ApiService = {
  init () {
    // Vue.use(VueAxios, axios)
    // Vue.axios.defaults.baseURL = API_URL
    // Vue.axios.defaults.withCredentials = true
  },

  setHeader () {
    // Vue.axios.defaults.headers.common['Authorization'] = `${JwtService.getToken()}`
  },

  query (resource, params) {
    return Vue.axios
      .get(resource, params)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  get (resource, slug = '') {
    if (slug) {
      resource += `?${slug}`
    }
    return Vue.axios
      .get(`${resource}`)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  },

  post (resource, params) {
    // console.log(params)
    return Vue.axios.post(`${resource}`, params)
  },

  update (resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params)
  },

  put (resource, params) {
    return Vue.axios
      .put(`${resource}`, params)
  },

  delete (resource) {
    return Vue.axios
      .delete(resource)
      .catch((error) => {
        throw new Error(`[RWV] ApiService ${error}`)
      })
  }
}

export default ApiService

export const ServicesService = {
  query (type, params) {
    return ApiService
      .query(
        'service' + (type === 'active' ? '/feed' : ''),
        { params: params }
      )
  },
  get (slug) {
    return ApiService.get('service')
  },
  post (params) {
    return ApiService.post('service', params)
  }
}

export const SessionsService = {
  get (active) {
    if (typeof active !== 'boolean') {
      throw new Error('[RWV] SessionsService.get() article slug required to fetch sessions')
    }
    return ApiService.get('session', `active=${active}`)
  },

  post (payload) {
    return ApiService.post('session', payload)
  },
  checkExpired () {
    return ApiService.post('session/check_expired')
  },
  flushAll () {
    return ApiService.post('flush')
  },
  destroy (sessionId) {
    return ApiService
      .delete(`session/${sessionId}`)
  }
}

export const InvitationsService = {
  get (active) {
    if (typeof active !== 'boolean') {
      throw new Error('[RWV] InvitationsService.get() article slug required to fetch invitations')
    }
    return ApiService.get('invitations', `active=${active}`)
  },

  post (payload) {
    return ApiService.post('invitation', payload)
  },
  destroy (invitationId) {
    return ApiService
      .delete(`invitation/${invitationId}`)
  }
}

export const ConnectionsService = {
  add (slug) {
    return ApiService.post(`articles/${slug}/favorite`)
  },
  remove (slug) {
    return ApiService.delete(`articles/${slug}/favorite`)
  }
}

export const AuthService = {
  doLogin (credentials) {
    return ApiService.post('login', credentials)
  },
  doLogout () {
    return ApiService.post('logout')
  }
}

export const PingService = {
  pingCore () {
    return ApiService.get('ownline-core/ping')
  },
  pingWeb () {
    return ApiService.get('ownline-web/ping')
  }
}

export const ConfigService = {
  get () {
    return ApiService.get('ownline/config')
  }
}

export const UserService = {
  get () {
    return ApiService.get('user')
  }
}

export const PublicIpService = {
  get () {
    return ApiService.get('public_ip')
  }
}

export const InitializeOwnlineCoreService = {
  post () {
    return ApiService.post('initialize')
  }
}
