<template>
    <v-dialog v-model="invitationDialog.active" max-width="400" :fullscreen="$vuetify.breakpoint.xsOnly" hide-overlay>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.stop="invitationDialog.active = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title><v-card-title>{{invitationDialog.title}}</v-card-title></v-toolbar-title>
      </v-toolbar>
      <v-card>
        <v-img v-if="invitationDialog.service !== undefined" :src="'/img/services/' + invitationDialog.service.image" height="200px"></v-img>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-sim-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>ID: {{invitationDialog.invitation.public_id}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-check-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Active: {{invitationDialog.invitation.active}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-clipboard-text</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Message</v-list-item-title>
                <v-textarea
                  v-text="invitationDialog.invitation.message"
                  readonly
                ></v-textarea>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-timer</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Duration: {{invitationDialog.invitation.duration}} mins</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-key</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Token: {{invitationDialog.invitation.sec_token}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-clipboard-text</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>End: {{endDate}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-avatar>
                <v-icon>mdi-link-variant</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>Link:
                  <v-text-field solo v-model="invitationLink" ref="invitationLink">
                    <template v-slot:append>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn icon ripple v-on="on" @click.stop="copyInvitationLink">
                            <v-icon>mdi-content-copy</v-icon>
                          </v-btn>
                        </template>
                        <span>Copy link</span>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" outlined @click.native="goToInvitation">Go to</v-btn>
          <v-btn color="red darken-1" outlined @click.native="deleteInvitation">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>

import { mapGetters } from 'vuex'
import { HIDE_INVITATION_DIALOG, DELETE_INVITATION } from '@/store/actions.type'

export default {
  name: 'InvitationDialog',
  props: {
  },
  computed: {
    ...mapGetters([
      'invitationDialog',
      'hostName',
      'invitationUrl',
      'servicesSelectList'
    ]),
    endDate () {
      return new Date(this.invitationDialog.invitation.end_timestamp * 1000)
    },
    invitationLink () {
      return this.invitationUrl + this.invitationDialog.invitation.sec_token
    }
  },
  data () {
    return {
      invitationMessage: undefined
    }
  },
  mounted () {

  },
  beforeDestroy () {
  },
  watch: {
  },
  methods: {
    hideInvitationDialog () {
      this.$store.dispatch(HIDE_INVITATION_DIALOG)
    },
    deleteInvitation () {
      this.$store.dispatch(DELETE_INVITATION, this.invitationDialog.invitation.public_id)
      this.hideInvitationDialog()
    },
    goToInvitation () {
      this.hideInvitationDialog()
    },
    copyInvitationLink () {
      const textToCopy = this.$refs.invitationLink.$el.querySelector('input')
      textToCopy.select()
      document.execCommand('copy')
    }
  }
}
</script>

<style lang="scss">
  #invitationId {
    font-size: 0.8em
  }
</style>
