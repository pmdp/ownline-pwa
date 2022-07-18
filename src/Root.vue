<template>
  <router-view/>
</template>

<script>
import { mapGetters } from 'vuex'
import { CHECK_AUTH, PING_OWNLINE_WEB, PING_OWNLINE_CORE } from '@/store/actions.type'
import { LocalStorageService, ID_LOGGED_IN, ID_COOKIE_EXPIRATION_TIME } from '@/common/localStorage.service'

export default {
  name: 'Root',
  computed: {
    ...mapGetters([
      'isAuthenticated'
    ])
  },
  data () {
    return {
      authenticationInterval: Object
    }
  },
  mounted () {
    console.log('Root module started')
    this.checkAuthenticationInterval()
    this.checkOwnlineCoreConnectionInterval()
    this.checkOwnlineWebConnectionInterval()
    // this.$store.dispatch(CHECK_AUTH)
    // this.$store.dispatch(CHECK_AUTH).then(() => {
    //   if (!this.isAuthenticated) {
    //     this.$router.push({name: 'login'})
    //   } else {
    //     this.$router.push({name: 'dashboard'})
    //   }
    // })
  },
  beforeDestroy () {
    clearInterval(this.authenticationInterval)
    // clearInterval(this.ownlineCoreConnectionInterval)
  },
  watch: {
    // isAuthenticated: {
    //   immediate: true,
    //   handler (newVal, oldVal) {
    //     console.log('Authenticated: ', newVal)
    //     if (!newVal) {
    //       this.$router.push({name: 'login'})
    //     } else {
    //       this.$router.push({name: 'dashboard'})
    //     }
    //   }
    // }
  },
  methods: {
    checkAuthenticationInterval () {
      this.checkAuthentication()
      this.authenticationInterval = setInterval(() => {
        this.checkAuthentication()
      }, 5000)
    },
    checkAuthentication () {
      console.info('executed checkAuthenticationInterval')
      console.info('Current timestamp: ', (new Date().getTime() + new Date().getTimezoneOffset() * 1000))
      console.info('Cookie ExpiredAt:  ', LocalStorageService.getInt(ID_COOKIE_EXPIRATION_TIME))

      if (!LocalStorageService.getBoolean(ID_LOGGED_IN) || (Date.now() > LocalStorageService.getInt(ID_COOKIE_EXPIRATION_TIME))) {
        console.log('Not logged in or cookie expired')
        LocalStorageService.set(ID_LOGGED_IN, false)
        if (this.$router.currentRoute.name !== 'login' && this.$router.currentRoute.name !== 'client') {
          this.$router.push({ name: 'login' }).catch(err => { console.error(err) })
        }
      } else if (this.$router.currentRoute.name === 'login') {
        this.$router.push({ name: 'dashboard' }).catch(err => { console.error(err) })
      }
      this.$store.dispatch(CHECK_AUTH)
    },
    checkOwnlineWebConnectionInterval () {
      this.checkOwnlineWebStatus()
      // this.ownlineCoreConnectionInterval = setInterval(() => {
      //   this.checkOwnlineCoreStatus()
      // }, 10000)
    },
    checkOwnlineWebStatus () {
      this.$store.dispatch(PING_OWNLINE_WEB).then(() => {
        console.log('ownline web backend is active')
        // if (this.$router.currentRoute.name === 'client') {
        //   this.$router.push({ name: 'login' }).catch(err => { console.error(err) })
        // }
        return true
      }).catch(() => {
        console.log('ownline web backend unreachable')
        // if (this.$router.currentRoute.name !== 'client') {
        //   this.$router.push({ name: 'client' }).catch(err => { console.error(err) })
        // }
        return false
      })
    },
    checkOwnlineCoreConnectionInterval () {
      this.checkOwnlineCoreStatus()
      // this.ownlineCoreConnectionInterval = setInterval(() => {
      //   this.checkOwnlineCoreStatus()
      // }, 30000)
    },
    checkOwnlineCoreStatus () {
      this.$store.dispatch(PING_OWNLINE_CORE).then(() => {
        console.log('ownline core backend is active')
        return true
      }).catch(() => {
        console.log('ownline core backend unreachable')
        return false
      })
    }
  }
}
</script>
