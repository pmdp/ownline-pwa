<template>
<v-app id="ownline-client-root">
  <v-content>
    <v-container fluid fill-height>
      <v-row  align="center" justify="center">
        <v-col xs="12" sm="8" md="4">
          <v-card class="elevation-20">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Client</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form id="clientConfigForm">
                <v-textarea
                  outlined
                  id="configJsonTextArea"
                  label="Client configuration"
                  v-model="clientConfig"
                  rows="8"
                  row-height="30"
                ></v-textarea>
                <v-spacer></v-spacer>
                <v-text-field class="d-none" name="username" autocomplete="username" type="text" v-model="clientFakeUsername" label="Username"></v-text-field>
                <v-text-field class="d-none" name="password" autocomplete="current-password" type="password" v-model="clientConfig" label="Password"></v-text-field>
                <v-text-field outlined
                              clearable
                              type="text"
                              v-model="publicIp"
                              label="Public IP"
                              @click="refreshPublicIp">
                  <template v-slot:append>
                    <v-fade-transition leave-absolute>
                      <v-progress-circular
                        v-if="loadingIp"
                        size="24"
                        color="info"
                        indeterminate
                      ></v-progress-circular>
                      <v-icon v-else @click="refreshPublicIp">mdi-refresh</v-icon>
                    </v-fade-transition>
                  </template>
                </v-text-field>
                <p class="login-error" v-text="clientError"></p>
                <v-card-actions>
                  <v-btn icon @click="goToLogin" color="white"><v-icon dark>mdi-arrow-left</v-icon></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn @click="sendOwnlineMessage" color="primary" :loading="loadingSendOwnlineMessage">SEND</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import { LOGIN } from '@/store/actions.type'
import { Client, Message } from 'paho-mqtt'
import jsSHA from 'jssha'

export default {
  name: 'OwnlineClient',
  data () {
    return {
      color: '',
      clientConfig: '',
      publicIp: '',
      loadingIp: false,
      clientFakeUsername: 'clientConfigUserName',
      loadingSendOwnlineMessage: false,
      clientError: ''
    }
  },
  mounted () {
    this.color = this.getRandomColor()
    document.getElementById('ownline-client-root').style.backgroundColor = this.color
    this.refreshPublicIp()
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
    goToLogin () {
      this.$router.push({ name: 'login' }).catch(err => { console.error(err) })
    },
    sendOwnlineMessage () {
      this.loadingSendOwnlineMessage = true
      const config = JSON.parse(this.clientConfig)
      const publicIp = this.publicIp
      const clientConfig = this.clientConfig
      const clientFakeUsername = this.clientFakeUsername
      // eslint-disable-next-line no-unused-vars

      // Create a client instance
      const client = new Client(config.mqtt_host, config.mqtt_port, '', 'clientId')

      // set callback handlers
      client.onConnectionLost = function (responseObject) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
      }
      client.onMessageArrived = function (message) {
        console.log('onMessageArrived:' + message.payloadString)
      }
      client.onMessageDelivered = function (message) {
        console.log('onMessageDelivered:' + message.payloadString)
        if (window.PasswordCredential) {
          // const clientConfigForm = document.getElementById('clientConfigForm')
          const clientConfigForm = { id: clientFakeUsername, password: clientConfig }
          // eslint-disable-next-line no-undef
          var c = new PasswordCredential(clientConfigForm)
          return navigator.credentials.store(c)
        }
      }

      var options = {
        useSSL: true,
        userName: config.mqtt_username,
        password: config.mqtt_password,
        onSuccess: function () {
          console.log('Connect succesfull to WebSocket')
          const msg = { user_id: config.ownline_user_id, trusted_ip: publicIp }

          const jsonMsg = JSON.stringify(msg)
          // eslint-disable-next-line new-cap
          const shaObj = new jsSHA('SHA-512', 'TEXT')
          shaObj.setHMACKey(config.hmac_key, 'TEXT')
          shaObj.update(jsonMsg)
          const hmac = shaObj.getHMAC('HEX')
          // eslint-disable-next-line camelcase
          const signedMessage = { signature: hmac, msg: msg }

          console.log('Sending message: ' + JSON.stringify(signedMessage))
          const message = new Message(JSON.stringify(signedMessage))
          message.destinationName = config.mqtt_topic
          message.retained = false
          client.send(message)
          client.disconnect()
        },
        onFailure: function (responseObject) {
          if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage)
          }
        }
      }

      // connect the client
      client.connect(options)
      this.loadingSendOwnlineMessage = false
      return false
    },
    refreshPublicIp () {
      this.loadingIp = true
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(response => {
          this.publicIp = response.ip
          this.loadingIp = false
        })
        .catch(function (error) {
          console.log(error)
          return false
        })
    }
  },
  computed: {
    ...mapGetters([
      'loginError'
    ])
  }
}
</script>

<style lang="scss">
.login-error {
  color: red;
}

  #configJsonTextArea {
    font-size: 0.8em;
  }
</style>
