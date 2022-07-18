<template>
  <v-dialog v-model="serviceDialog.active" max-width="400" :fullscreen="$vuetify.breakpoint.xsOnly" hide-overlay>
    <v-toolbar dark color="primary">
      <v-btn icon dark @click.stop="serviceDialog.active = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Service</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-img :src="'/img/services/' + serviceDialog.service.image" height="200px"></v-img>
      <v-card-title>{{serviceDialog.title}}</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-protocol</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <v-label><code>{{serviceDialog.service.protocol}}</code></v-label>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-autorenew</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <v-switch v-model="switchAutoReload" label="Auto reload"></v-switch>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="switchAutoReload">
            <v-list-item-avatar>
              <v-icon>mdi-application-import</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <v-label>Port:</v-label>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-text-field
                  outlined
                  v-model.number="serviceDialog.service.port_dst"
                  type="number"
                  min="5000"
                  max="65535"
                  hide-details
                  single-line
                ></v-text-field>
              </v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-clock-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <v-label>Duration:</v-label>
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-text-field
                  outlined
                  v-model="duration"
                ></v-text-field>
              </v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="haveCurrentSession">ACTIVE SESSION</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" outlined @click.native="onClickSaveService">SAVE</v-btn>
        <v-btn color="blue darken-1" outlined @click.native="onClickSessionRequest">CREATE SESSION</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { HIDE_SERVICE_DIALOG, SESSION_REQUEST, UPDATE_SERVICE_CONFIG } from '@/store/actions.type'

export default {
  name: 'ServiceDialog',
  props: {},
  computed: {
    ...mapGetters([
      'serviceDialog',
      'activeSessions'
    ]),
    endDate () {
      return new Date()
    },
    switchAutoReload: {
      get: function () {
        return this.serviceDialog.service.automatic
      },
      set: function (data) {
        this.serviceDialog.service.automatic = data
        return data
      }
    },
    haveCurrentSession () {
      // this.serviceDialog.service.public_id in this.activeSessions
      return false
    }
  },
  data () {
    return {
      g: false,
      duration: 30
    }
  },
  mounted () {

  },
  beforeDestroy () {
  },
  watch: {
    switchAutoReload: function () {
      console.log('Auto reload on/off')
    }
  },
  methods: {
    hideServiceDialog () {
      this.$store.dispatch(HIDE_SERVICE_DIALOG)
    },
    onClickSessionRequest () {
      this.loading = true
      this.$store.dispatch(SESSION_REQUEST, {
        service_id: this.serviceDialog.service.public_id,
        duration: this.duration
      }).finally(data => {
        console.log('do it', data)
        this.loading = false
        this.$store.dispatch(HIDE_SERVICE_DIALOG)
      })
    },
    onClickSaveService () {
      if (this.serviceDialog !== undefined) {
        const updatObj = {
          public_id: this.serviceDialog.service.public_id,
          automatic: this.serviceDialog.service.automatic,
          port_dst: this.serviceDialog.service.port_dst
        }
        this.$store.dispatch(UPDATE_SERVICE_CONFIG, updatObj)
      }
    }
  }
}
</script>
