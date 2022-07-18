<template>
    <v-dialog v-model="createInvitationDialog.active" max-width="400" :fullscreen="$vuetify.breakpoint.xsOnly" hide-overlay>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.stop="createInvitationDialog.active = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title><v-card-title>{{createInvitationDialog.title}}</v-card-title></v-toolbar-title>
      </v-toolbar>
      <v-card>
<!--        <v-img :src="'/img/services/' + createInvitationDialog.service_img" height="200px"></v-img>-->

        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-clipboard-text</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Message</v-list-item-title>
                <v-textarea
                  v-model="invitationMessage"
                  label="Invitation message"
                  rows="1"
                  auto-grow
                  counter
                ></v-textarea>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-application-import</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title></v-list-item-title>
                <v-select
                  v-model="selectedService"
                  :items="servicesSelectList"
                  item-text="name"
                  item-value="public_id"
                  :hint="`${selectedService.name}, ${selectedService.public_id}`"
                  label="Service"
                  persistent-hint
                  return-object
                  solo
                >
                  <template v-slot:selection="{ item }">
                    <v-img class="mr-2" max-width="30" :src="'/img/services/' + item.image"></v-img>
                    {{ item.name }}
                  </template>
                  <template v-slot:item="{ item }">
                    <v-img class="mr-2" max-width="30" :src="'/img/services/' + item.image"></v-img>
                    {{ item.name }}
                  </template>
                </v-select>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-clock-time-eight-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Duration</v-list-item-title>
                <v-select
                  v-model="selectedDuration"
                  :items="invitationDurations"
                  item-text="text"
                  item-value="value"
                  return-object
                  single-line
                ></v-select>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" outlined @click.native="createInvitation">Create</v-btn>
          <v-btn color="red darken-1" outlined @click.native="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import { HIDE_CREATE_INVITATION_DIALOG, CREATE_INVITATION } from '@/store/actions.type'

export default {
  name: 'CreateInvitationDialog',
  props: {
  },
  computed: {
    ...mapGetters([
      'createInvitationDialog',
      'hostName',
      'servicesSelectList'
    ]),
    endDate () {
      return new Date(this.createInvitationDialog.invitation.end_timestamp * 1000)
    },
    invitationUrl () {
      return 'https://' + this.createInvitationDialog.service_name + '.' + this.hostName + ':' + this.createInvitationDialog.invitation.port_dst
    }
  },
  data () {
    return {
      invitationMessage: undefined,
      selectedService: {
        name: undefined,
        public_id: undefined
      },
      selectedDuration: {
        text: undefined,
        value: undefined
      },
      invitationDurations: [
        { text: '5 min', value: 5 },
        { text: '10 min', value: 10 },
        { text: '30 min', value: 30 },
        { text: '1 h', value: 60 },
        { text: '2 h', value: 120 },
        { text: '6 h', value: 360 },
        { text: '12 h', value: 720 },
        { text: '24 h', value: 1440 }
      ]
    }
  },
  mounted () {

  },
  beforeDestroy () {
  },
  watch: {
  },
  methods: {
    hideCreateInvitationDialog () {
      this.$store.dispatch(HIDE_CREATE_INVITATION_DIALOG)
    },
    cancel () {
      this.hideCreateInvitationDialog()
    },
    createInvitation () {
      console.log(`Creating: ${this.invitationUrl}`)
      const invitationData = {
        message: this.invitationMessage,
        service_id: this.selectedService.public_id,
        duration: this.selectedDuration.value
      }
      this.$store.dispatch(CREATE_INVITATION, invitationData)
    }
  }
}
</script>

<style lang="scss">
  #invitationId {
    font-size: 0.8em
  }
</style>
