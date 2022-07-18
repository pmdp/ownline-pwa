<template>
  <v-app id="login-root">
    <v-content>
      <v-container fluid fill-height>
        <v-row  align="center" justify="center">
          <v-col xs="12" sm="8" md="4">
            <v-card class="elevation-20">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <div v-if="ownlineWebState" class="ownlineWebStateText">WEB REACHABLE</div>
                <div v-if="!ownlineWebState" class="ownlineWebStateText">WEB UNREACHABLE</div>
                <div v-if="!ownlineWebStateLoading" class="ownlineWebStateIndicator" :class="[ownlineWebState ? 'green' : 'red']" @click.stop="pingOwnlineWeb"></div>
                <v-progress-circular v-else indeterminate color="accent" :size="20"></v-progress-circular>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="username" prepend-icon="mdi-account" name="login" label="Login" type="text" autocomplete="username"></v-text-field>
                  <v-text-field v-model="password" id="password" prepend-icon="mdi-lock" name="password" label="Password" type="password" autocomplete="current-password"></v-text-field>
                </v-form>
              </v-card-text>
              <p class="login-error" v-text="loginError"></p>
              <v-card-actions>
                <v-btn tile outlined color="info" @click="goToClient()">
                  Client <v-icon right>mdi-home-import-outline</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn tile color="success" @click="onLogin(username, password)">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import { LOGIN, PING_OWNLINE_WEB, SHOW_SNACKBAR } from '@/store/actions.type'

export default {
  name: 'Login',
  data () {
    return {
      username: null,
      password: null,
      color: ''
    }
  },
  mounted () {
    this.color = this.getRandomColor()
    document.getElementById('login-root').style.backgroundColor = this.color
  },
  methods: {
    onLogin (username, password) {
      this.$store
        .dispatch(LOGIN, { username, password })
        .then(() => this.$router.push({ name: 'dashboard' }))
    },
    getRandomColor () {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },
    goToClient () {
      this.$router.push({ name: 'client' }).catch(err => { console.error(err) })
    },
    pingOwnlineWeb () {
      this.$store.dispatch(PING_OWNLINE_WEB).then(() => {
        const data = {
          content: 'ownline-web answer ping OK',
          color: 'success',
          timeout: 3000
        }
        this.$store.dispatch(SHOW_SNACKBAR, data)
      }).catch(() => {
        const data = {
          content: 'No connection to ownline-web',
          color: 'error',
          timeout: 3000
        }
        this.$store.dispatch(SHOW_SNACKBAR, data)
      })
    }
  },
  computed: {
    ...mapGetters([
      'loginError',
      'ownlineWebState',
      'ownlineWebStateLoading'
    ])
  }
}
</script>

<style lang="scss">
.login-error {
  color: red;
}

.ownlineWebStateIndicator {
  height: 15px;
  width: 15px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 10px;
}

.ownlineWebStateText {
  font-size: 0.85em;
}

</style>
