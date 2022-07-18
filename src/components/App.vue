<template>
  <v-app id="ownline" :dark="dark">
    <v-navigation-drawer clipped v-model="drawer" app overflow>
      <div class="navigator-drawer-header">
        <div class="avatar-container">
          <v-img class="image" :src="'/img/users/' + user.avatar"/>
        </div>
        <div class="contact-info">
          <div class="name" v-text="user.name"></div>
          <div class="ip" v-text="publicIp"></div>
        </div>
      </div>
      <v-list>
        <v-list-item @click.stop="logout" slot="activator">
          <v-list-item-action>
            <v-icon>mdi-power</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left dense app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="ownlineCoreState" class="ownlineCoreStateText">CORE REACHABLE</div>
      <div v-if="!ownlineCoreState" class="ownlineCoreStateText">CORE UNREACHABLE</div>
      <div v-if="!ownlineCoreStateLoading" class="ownlineCoreStateIndicator" :class="[ownlineCoreState ? 'green' : 'red']" @click="pingOwnlineCore"></div>
      <v-progress-circular v-else indeterminate color="accent" :size="20"></v-progress-circular>
      <v-menu bottom left offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item avatar @click="toggleDarkMode">
            <v-list-item-icon>
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="dark ? 'Dark' : 'Light'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item avatar @click="flushAllSessions">
            <v-list-item-icon>
              <v-icon>mdi-close-circle-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Flush all sessions</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item avatar @click="initializeOwnlineCore">
            <v-list-item-icon>
              <v-icon>mdi-close-circle-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Initialize ownline core</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item avatar @click="checkExpired">
            <v-list-item-icon>
              <v-icon>mdi-reload</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Check expired</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item avatar @click="goToClient">
            <v-list-item-icon>
              <v-icon>mdi-application-import</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Client</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item avatar @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container :pa-1="$vuetify.breakpoint.xs"  :pa-3="$vuetify.breakpoint.mdAndUp">
        <router-view/>
      </v-container>
    </v-main>

    <v-bottom-navigation app fixed shift v-model="bottomNav">
      <v-btn large class="navBtn" value="dashboard" to="/">
        <span>Dashboard</span>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
      <v-btn large class="navBtn" value="services" :to="{ name: 'services' }">
        <span>Services</span>
        <v-icon>mdi-cloud</v-icon>
      </v-btn>
      <v-btn large class="navBtn" value="history" :to="{ name: 'history' }">
        <span>History</span>
        <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn large class="navBtn" value="settings" :to="{ name: 'settings' }">
        <span>Settings</span>
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-snackbar bottom left :multi-line="snackbar.multiline" vertical :timeout="snackbar.timeout" :color="snackbar.color" v-model="snackbar.active">
      {{ snackbar.content }}
      <v-btn text @click="snackbar.active = false">
        Close
      </v-btn>
    </v-snackbar>

    <session-dialog></session-dialog>

    <service-dialog></service-dialog>

    <create-invitation-dialog></create-invitation-dialog>

    <invitation-dialog></invitation-dialog>

  </v-app>

</template>

<script>
import { mapGetters } from 'vuex'
import SessionDialog from '@/components/sessions/SessionDialog'
import {
  LOGOUT,
  FETCH_SESSIONS,
  FETCH_SERVICES,
  FETCH_INVITATIONS,
  PING_OWNLINE_CORE,
  GET_PUBLIC_IP,
  USER_INFO,
  CHECK_EXPIRED,
  FETCH_CONFIG,
  FLUSH_ALL_SESSIONS,
  INITIALIZE_OWNLINE_CORE
} from '@/store/actions.type'

import { DARK_MODE_TOGGLE } from '@/store/mutations.type'
import ServiceDialog from './services/ServiceDialog'
import CreateInvitationDialog from './invitations/CreateInvitationDialog'
import InvitationDialog from './invitations/InvitationDialog'
// import { LocalStorageService, ID_LOGGED_IN, ID_COOKIE_EXPIRATION_TIME } from '@/common/localStorage.service'

export default {
  name: 'App',
  components: {
    ServiceDialog,
    SessionDialog,
    CreateInvitationDialog,
    InvitationDialog
  },
  computed: {
    ...mapGetters([
      'dark',
      'isAuthenticated',
      'user',
      'publicIp',
      'ownlineCoreState',
      'ownlineCoreStateTime',
      'ownlineCoreStateLoading',
      'snackbar'
    ])
  },
  data () {
    return {
      title: 'ownline',
      drawer: this.$vuetify.breakpoint.lgAndUp,
      bottomNav: undefined,
      durations: [3, 10, 30, 60]
    }
  },
  mounted () {
    console.log('App module started')

    this.$store.dispatch(FETCH_CONFIG)
    this.$store.dispatch(USER_INFO)
    this.$store.dispatch(GET_PUBLIC_IP)
    this.$store.dispatch(FETCH_SERVICES).then(() => {
      this.$store.dispatch(FETCH_SESSIONS, true)
      this.$store.dispatch(FETCH_SESSIONS, false)
    })
    this.$store.dispatch(FETCH_INVITATIONS, true)
    this.$store.dispatch(PING_OWNLINE_CORE)
    // this.checkAuthenticationInterval()
    // this.$store.dispatch(CHECK_AUTH)
    // this.$store.dispatch(CHECK_AUTH).then(() => {
    //   if (!this.isAuthenticated) {
    //     this.$router.push({name: 'login'})
    //   } else {
    //     this.$router.push({name: 'dashboard'})
    //   }
    // })
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
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    },
    logout () {
      this.$store.dispatch(LOGOUT)
        .then(() => {
          this.$router.push({ name: 'login' })
        })
    },
    pingOwnlineCore () {
      this.$store.dispatch(PING_OWNLINE_CORE)
    },
    toggleDarkMode () {
      this.$store.commit(DARK_MODE_TOGGLE)
      this.$vuetify.theme.primary = '#1A237E'
      if (this.dark) {
        this.$vuetify.theme.primary = '#4caf50'
        this.$vuetify.theme.dark = false
      } else {
        this.$vuetify.theme.primary = '#1A237E'
        this.$vuetify.theme.dark = true
      }
    },
    flushAllSessions () {
      this.$store.dispatch(FLUSH_ALL_SESSIONS, true)
    },
    checkExpired () {
      this.$store.dispatch(CHECK_EXPIRED, true)
    },
    goToClient () {
      this.$router.push({ name: 'client' }).catch(err => { console.error(err) })
    },
    initializeOwnlineCore () {
      this.$store.dispatch(INITIALIZE_OWNLINE_CORE, true)
    }
  }
}
</script>

<style lang="scss">
  .avatar-container {
    position: relative;
    border: 2px solid #00AA8D;
    border-radius: 50%;
    height: 90px;
    padding: 2px;
    width: 90px;
    margin: 20px auto;
  }
  .avatar-container .image {
    /*background-image: url('//app-layout-assets.appspot.com/assets/pesto/avatar.jpg');
    background-size: contain;*/
    border-radius: 50%;
    height: 100%;
    width: 100%;
  }

  .contact-info {
    margin: 0 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #CCC;
    text-align: center;
  }
  .contact-info .name {
    font-weight: bold;
  }
  .contact-info .ip {
    color: #999;
  }

  .section {
    /*background-color: grey;*/
    /*box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);*/
    margin-bottom: 10px;

    &.desktop {
      border-radius: 5px;
      margin-bottom: 15px;
    }
    .section-header {
      /*background-color: #004ba0;*/
      padding: 5px 15px;
      font-size: 16px;
      min-height: 35px;
      margin: 0;

      &.desktop {
        border-radius: 5px 5px 0 0;
      }
    }
    .section-title {
      color: white;
      float: left;
      font-size: 1.18em;
    }
    .section-count {
      color: white;
      float: right;
      padding: 0 5px;
      border-radius: 5px;
    }
    .section-actions {
      float: right;
      margin-right: 15px;
    }
    .section-container {
      /*padding: 5px;*/
    }
  }
  .ownlineCoreStateIndicator {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    cursor: pointer;
    margin-left: 10px;
  }

  .ownlineCoreStateText {
    font-size: 0.85em;
  }

  .navBtn {
    height: inherit !important;
  }
</style>
