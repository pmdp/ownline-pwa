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
      <div class="section-title">active sessions</div>
      <div class="section-count accent" v-text="activeSessionsCount"></div>
      <div class="section-actions">
        <v-icon size="20" dark @click="reloadActiveSessions">mdi-refresh</v-icon>
      </div>
    </div>
    <v-progress-linear v-show="activeSessionsLoading" :indeterminate="true" color="accent" class="loading-progress"></v-progress-linear>
    <div class="section-container ">
      <v-container v-if="activeSessionsLoading" fluid fill-height>
        <v-row align="center" justify="center">
          <v-col xs="12" class="col text-center">
            <v-progress-circular indeterminate color="accent" :size="30"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
      <div v-else-if="activeSessionsCount !== 0">
        <v-list class="active-sessions-list" dense>
          <!--<v-subheader inset>Folders</v-subheader>-->
          <session-element v-for="session in activeSessions" :key="session.public_id" :session="session"></session-element>
        </v-list>
      </div>
      <div v-else class="text-center pa-4">
        No current sessions
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SessionElement from '@/components/sessions/SessionElement'
import { FETCH_SESSIONS } from '@/store/actions.type'

export default {
  name: 'ActiveSessionsList',
  components: {
    SessionElement
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
      'activeSessions',
      'activeSessionsCount',
      'activeSessionsLoading'
    ])
  },
  mounted () {
    this.fetchSessions()
  },
  methods: {
    fetchSessions () {
      // this.$store.dispatch(FETCH_SESSIONS, true)
    },
    reloadActiveSessions () {
      this.$store.dispatch(FETCH_SESSIONS, true)
    }
  }
}
</script>

<style scoped>
  .loading-progress {
    margin: 0;
  }

  /*.active-sessions-list {*/
    /*overflow: scroll;*/
    /*max-height: 200px;*/
  /*}*/
</style>
