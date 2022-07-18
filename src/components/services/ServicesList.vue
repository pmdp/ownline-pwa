<template>
  <!--<div>-->
    <!--<div v-if="isLoading" class="">-->
      <!--Loading services...-->
    <!--</div>-->
    <!--<div v-else>-->
      <!--<v-container pa-1>-->
        <!--<v-layout row wrap d-flex>-->
          <!--<v-flex v-for="(service, index) in services" :key="index" xs4 sm3 md2 d-flex>-->
            <!--<service-preview :service="service"></service-preview>-->
          <!--</v-flex>-->
        <!--</v-layout>-->
      <!--</v-container>-->
    <!--</div>-->
  <!--</div>-->

  <div class="section elevation-5" :class="{desktop: $vuetify.breakpoint.smAndUp}">
    <div class="section-header primary" :class="{desktop: $vuetify.breakpoint.smAndUp}">
      <div class="section-title">services</div>
      <div class="section-count accent" v-text="servicesCount"></div>
    </div>
    <div class="section-container">
      <v-container v-if="servicesLoading" fluid>
        <v-row align="center" justify="center">
          <v-col xs="12" class="text-center">
            <v-progress-circular indeterminate color="accent" :size="30"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
      <div v-else>
        <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly" :pa-1="$vuetify.breakpoint.smOnly" :pa-2="$vuetify.breakpoint.mdAndUp">
          <v-row align="center" justify="center" no-gutters>
            <v-col cols="4" xs="4" sm="3" md="3" lg="2" v-for="service in services" :key="service.public_id">
              <service-preview class="ma-1 ma-lg-2" :service="service"></service-preview>
            </v-col>
          </v-row>
        </v-container>
        <!--<div class="ma-1 ma-xl-3 flex-grow-1 flex-shrink-0" v-for="service in services" :key="service.public_id">-->
          <!--<service-preview :service="service"></service-preview>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ServicePreview from '@/components/services/ServicePreview'
// import { FETCH_SERVICES } from '@/store/actions.type'

export default {
  name: 'ServicesList',
  components: {
    ServicePreview
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
      'services',
      'servicesCount',
      'servicesLoading'
    ])
  },
  mounted () {
    this.fetchServices()
  },
  methods: {
    fetchServices () {
      // this.$store.dispatch(FETCH_SERVICES)
    }
  }
}
</script>

<style scoped>

  /*overflow: auto;*/
  /*overflow-y: hidden;*/
</style>
