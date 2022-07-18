<template>
  <v-list-item ripple @click="onClick">
    <v-list-item-avatar>
      <!--<v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>-->
      <v-img :src="'/img/services/' + service.image"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ service.name }}</v-list-item-title>
      <v-list-item-subtitle>
        Until: <span class="endDate">{{ endDate }}</span>
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        Ends <span class="remainSessionTime">{{ remainSessionTime }}</span>
      </v-list-item-subtitle>
        <v-list-item-subtitle>
          From <span class="trustedIp">{{ session.trusted_ip }}</span>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="session.automatic">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon ripple v-on="on" @click.stop="">
            <v-icon color="grey lighten-1">mdi-refresh-auto</v-icon>
          </v-btn>
        </template>
        <span>Automatic session</span>
      </v-tooltip>
    </v-list-item-action>
    <v-list-item-action v-if="publicIp === session.trusted_ip">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon ripple v-on="on" @click.stop="">
            <v-icon color="grey lighten-1">mdi-cellphone-link</v-icon>
          </v-btn>
        </template>
        <span>Current Device</span>
      </v-tooltip>
    </v-list-item-action>
    <v-list-item-action class="d-none-xs">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon ripple v-on="on" @click.stop="goToSession">
            <v-icon color="grey lighten-1">mdi-chevron-right</v-icon>
          </v-btn>
        </template>
        <span>GO</span>
      </v-tooltip>
    </v-list-item-action>
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon ripple v-on="on" @click.stop="deleteSession">
            <v-icon color="grey lighten-1">mdi-cancel</v-icon>
          </v-btn>
        </template>
        <span>Cancel</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { SHOW_SESSION_DIALOG, DELETE_SESSION } from '@/store/actions.type'
import { mapGetters } from 'vuex'

import moment from 'moment'

export default {
  name: 'SessionElement',
  props: {
    session: { type: Object, required: true }
  },
  data () {
    return {
      loading: false,
      remainSeconds: undefined
    }
  },
  created () {
    this.updateRemainSeconds()
  },
  computed: {
    ...mapGetters([
      'hostName',
      'publicIp',
      'serviceById'
    ]),
    endDate () {
      console.log('Time stamp:' + this.session.end_timestamp)
      var date = new Date(0)
      date.setUTCSeconds(this.session.end_timestamp)
      const options = { weekday: 'short', month: 'short', day: 'numeric' }
      // console.log('to locale: ' + localDate.toLocaleString('es-ES', options) + localDate.toLocaleTimeString('es-ES'))
      var timeOptions = { timeZone: 'Europe/Madrid', timeZoneName: 'short' }
      // return `${date.getDay()} ${date.to()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

      return date.toLocaleString('es-ES', options) + ' ' + date.toLocaleTimeString('es-ES', timeOptions)

      // var unixTimestamp = 1553617238
      // var date = new Date(unixTimestamp*1000)
      //
      // var date = new Date()
      // var day = date.getDate()
      // var month = date.getMonth()
      // var year = date.getFullYear()
      // var fullDate = day + "-" +(month + 1) + "-" + year
    },
    sessionUrl () {
      const service = this.serviceById(this.session.service_id)
      return `https://${service.name}.${this.hostName}:${this.session.port_dst}${service.path_dst_lan !== '' ? service.path_dst_lan : ''}`
    },
    service () {
      return this.serviceById(this.session.service_id)
    }
  },
  methods: {
    onClick () {
      console.log('session: ', this.session)
      // this.loading = true
      const dialogData = {
        title: `Session to ${this.service.name}`,
        service_img: this.service.image,
        service_name: this.service.name,
        service_protocol: this.service.protocol,
        service_path: this.service.path_dst_lan,
        session: this.session
      }
      this.$store.dispatch(SHOW_SESSION_DIALOG, dialogData)
    },
    deleteSession () {
      console.log('Deleting session')
      this.$store.dispatch(DELETE_SESSION, this.session.public_id)
    },
    goToSession () {
      console.log(`Going to: ${this.sessionUrl}`)
      window.open(this.sessionUrl, '_blank')
    },
    updateRemainSeconds () {
      // var diff = this.session.end_timestamp - (Math.round(new Date().getTime() / 1000))
      var fromNow = moment.unix(this.session.end_timestamp).fromNow()
      this.remainSessionTime = fromNow
    }
  }
}
</script>

<style lang="scss" scoped>

  .trustedIp, .endDate, remainSessionTime {
    font-weight: bolder;
  }

</style>
