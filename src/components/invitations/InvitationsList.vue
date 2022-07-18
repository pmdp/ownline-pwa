<template>
  <!--<v-container pa-1>-->
  <!--<v-layout row wrap d-flex>-->
  <!--<v-flex v-for="(service, index) in history" :key="index" xs4 sm3 md2 d-flex>-->
  <!--<history-element :element="service"></history-element>-->
  <!--</v-flex>-->
  <!--</v-layout>-->
  <!--</v-container>-->
  <div class="section elevation-5" :class="{desktop: $vuetify.breakpoint.smAndUp}">
    <div class="section-header primary" :class="{desktop: $vuetify.breakpoint.smAndUp}">
      <div class="section-title">invitations</div>
      <div class="section-count accent" v-text="activeInvitationsCount"></div>
      <div class="section-actions">
        <v-icon size="20" dark @click="reloadActiveInvitations">mdi-refresh</v-icon>
      </div>
    </div>
    <v-progress-linear v-show="activeInvitationsLoading" :indeterminate="true" color="accent" class="loading-progress"></v-progress-linear>
    <div class="section-container ">
      <v-container v-if="activeInvitationsLoading" fluid fill-height>
        <v-row align="center" justify="center">
          <v-col xs="12" class="col text-center">
            <v-progress-circular indeterminate color="accent" :size="30"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
      <div v-else-if="activeInvitationsCount !== 0">
        <v-list class="active-invitations-list" dense>
          <!--<v-subheader inset>Folders</v-subheader>-->
          <invitation-element v-for="invitation in activeInvitations" :key="invitation.public_id" :element="invitation"></invitation-element>
        </v-list>
      </div>
      <div v-else class="text-center pa-4">
        No current invitations
      </div>
      <div>
        <v-fab-transition>
          <v-btn color="pink" fab ripple small right @click="createInvitation">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InvitationElement from '@/components/invitations/InvitationElement'
import { FETCH_INVITATIONS, SHOW_CREATE_INVITATION_DIALOG } from '@/store/actions.type'

export default {
  name: 'InvitationsList',
  components: {
    InvitationElement
  },
  props: {
    test: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      sample: 1
    }
  },
  computed: {
    ...mapGetters([
      'activeInvitations',
      'activeInvitationsCount',
      'activeInvitationsLoading'
    ])
  },
  mounted () {
    // this.fetchInvitations()
  },
  methods: {
    fetchInvitations () {
      // this.$store.dispatch(FETCH_INVITATIONS, true)
    },
    reloadActiveInvitations () {
      this.$store.dispatch(FETCH_INVITATIONS, true)
    },
    createInvitation () {
      const dialogData = {
        title: 'New Invitation'
      }
      this.$store.dispatch(SHOW_CREATE_INVITATION_DIALOG, dialogData)
    }
  }
}
</script>

<style scoped>
  .loading-progress {
    margin: 0;
  }

  /*.active-invitations-list {*/
    /*overflow: scroll;*/
    /*max-height: 200px;*/
  /*}*/
</style>
