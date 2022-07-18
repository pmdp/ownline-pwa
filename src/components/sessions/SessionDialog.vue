<template>
    <v-dialog v-model="sessionDialog.active" max-width="400" :fullscreen="$vuetify.breakpoint.xsOnly" hide-overlay>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.stop="sessionDialog.active = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title></v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-img :src="'/img/services/' + sessionDialog.service_img" height="200px"></v-img>
        <v-card-title>{{sessionDialog.title}}</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-check-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Status: {{sessionDialog.active}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-key</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>ID: <code id="sessionId">{{sessionDialog.session.public_id}}</code></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-cloud-check</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Source IP: <code>{{sessionDialog.session.trusted_ip}}</code></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-home-import-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Port: <code>{{sessionDialog.session.port_dst}}</code></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-protocol</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Protocol: <code>{{sessionDialog.service_protocol}}</code></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-timer</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Duration: {{sessionDialog.session.duration}} mins</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-timelapse</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>End: {{endDate}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" outlined @click.native="goToSession">Go to</v-btn>
          <v-btn color="red darken-1" outlined @click.native="deleteSession">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import { HIDE_SESSION_DIALOG, DELETE_SESSION } from '@/store/actions.type'

export default {
  name: 'SessionDialog',
  props: {
  },
  computed: {
    ...mapGetters([
      'sessionDialog',
      'hostName'
    ]),
    endDate () {
      return new Date(this.sessionDialog.session.end_timestamp * 1000)
    },
    sessionUrl () {
      return `https://${this.sessionDialog.service_name}.${this.hostName}:${this.sessionDialog.session.port_dst}${this.sessionDialog.service_path !== '' ? this.sessionDialog.service_path : ''}`
    }
  },
  data () {
    return {
      g: false
    }
  },
  mounted () {

  },
  beforeDestroy () {
  },
  watch: {
  },
  methods: {
    hideSessionDialog () {
      this.$store.dispatch(HIDE_SESSION_DIALOG)
    },
    deleteSession () {
      this.$store.dispatch(DELETE_SESSION, this.sessionDialog.session.public_id)
      this.$store.dispatch(HIDE_SESSION_DIALOG)
    },
    goToSession () {
      console.log(`Going to: ${this.sessionUrl}`)
      window.open(this.sessionUrl, '_blank')
    }
  }
}
</script>

<style lang="scss">
  #sessionId {
    font-size: 0.8em
  }
</style>
