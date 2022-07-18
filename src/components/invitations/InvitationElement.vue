<template>
  <v-list-item ripple @click="onClick">
    <v-list-item-avatar>
      <!--<v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>-->
      <v-img :src="'/img/services/' + (service && 'image' in service ? service.image : 'defualt.png')"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ this.element.message }}</v-list-item-title>
      <v-list-item-subtitle>
        Service: <span>{{ service && 'name' in service ? service.name : 'none' }}</span>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        Until: <span class="endDate">{{ endDate }}</span>
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        Ends <span class="remainInvitationTime">{{ remainInvitationTime }}</span>
      </v-list-item-subtitle>

    </v-list-item-content>
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon ripple v-on="on" @click.stop="">
            <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
          </v-btn>
        </template>
        <span>Copy URL</span>
      </v-tooltip>
    </v-list-item-action>
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon ripple v-on="on" @click.stop="deleteInvitation">
            <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { SHOW_INVITATION_DIALOG, DELETE_INVITATION } from '@/store/actions.type'
import { mapGetters } from 'vuex'

import moment from 'moment'

export default {
  name: 'InvitationElement',
  props: {
    element: { type: Object, required: true }
  },
  data () {
    return {
      loading: false,
      remainInvitationTime: undefined
    }
  },
  created () {
    this.updateRemainSeconds()
  },
  mounted () {
    // this.fetchInvitations()
  },
  computed: {
    ...mapGetters([
      'hostName',
      'publicIp',
      'serviceById'
    ]),
    endDate () {
      console.log('Time stamp:' + this.element.end_timestamp)
      var date = new Date(0)
      date.setUTCSeconds(this.element.end_timestamp)
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
    invitationUrl () {
      // if (this.element.service_name === 'nextcloud') {
      //   return 'nc://' + this.element.service_name // + '.' + this.hostName + ':' + this.element.invitation.port_dst
      // }
      return 'https://' + this.serviceName + '.' + this.hostName + ':' + this.element.invitation.port_dst
    },
    service () {
      return this.serviceById(this.element.service_id)
    }
  },
  watch: {
    service (newService, oldService) {
      // console.log('New service: ', newService)
    }
  },
  methods: {
    onClick () {
      // this.loading = true
      const dialogData = {
        title: `Invitation to ${this.service.name}`,
        service: this.service,
        invitation: this.element
      }
      this.$store.dispatch(SHOW_INVITATION_DIALOG, dialogData)
    },
    deleteInvitation () {
      this.$store.dispatch(DELETE_INVITATION, this.element.public_id)
    },
    goToInvitation () {
      console.log(`Going to: ${this.invitationUrl}`)
      window.open(this.invitationUrl, '_blank')
    },
    updateRemainSeconds () {
      // var diff = this.element.end_timestamp - (Math.round(new Date().getTime() / 1000))
      var fromNow = moment.unix(this.element.end_timestamp).fromNow()
      this.remainInvitationTime = fromNow
    }
  }
}
</script>

<style lang="scss" scoped>

  .trustedIp, .endDate, remainInvitationTime {
    font-weight: bolder;
  }

</style>
