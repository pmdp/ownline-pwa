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
      <div class="section-title">history</div>
      <div class="section-count accent" v-text="historySessionsCount"></div>
      <div class="section-actions">
        <v-icon size="20" @click="fetchHistorySessions">mdi-refresh</v-icon>
      </div>
    </div>
    <div class="section-container">
      <v-container v-if="historySessionsLoading" fluid fill-height>
        <v-row align="center" justify="center">
          <v-col xs="12" class="col text-center">
            <v-progress-circular indeterminate color="accent" :size="30"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
      <v-list v-else class="history-list" :max-height="listHeight">
        <history-element v-for="(session, index) in historySessions" :key="index" :element="session"></history-element>
      </v-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistoryElement from '@/components/HistoryElement'
import { CHECK_EXPIRED, FETCH_SESSIONS } from '@/store/actions.type'

export default {
  name: 'HistoryList',
  components: {
    HistoryElement
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
      'historySessions',
      'historySessionsCount',
      'historySessionsLoading'
    ]),
    listHeight () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return undefined
        case 'sm': return undefined
        case 'md': return 300
        case 'lg': return 600
        case 'xl': return 800
        default: return undefined
      }
    }
  },
  mounted () {
    // this.fetchHistorySessions()
  },
  methods: {
    fetchHistorySessions () {
      this.$store.dispatch(FETCH_SESSIONS, false)
    },
    checkExpired () {
      this.$store.dispatch(CHECK_EXPIRED, true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .history-list {
    overflow: scroll;
    /*max-height: 500px;*/

    &::-webkit-scrollbar {
       display: none;
     }

  }
</style>
