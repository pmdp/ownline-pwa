<template>
  <v-container>
    <v-row xs12>
      <v-slider v-model="slider" thumb-label="always"></v-slider>

      <v-switch v-model="darkModeSwitch" label="Switch 1"></v-switch>

    </v-row>
  </v-container>

</template>

<script>
import { mapGetters } from 'vuex'
// import { FETCH_SERVICES } from '@/store/actions.type'

export default {
  name: 'SettingsView',
  components: {
  },
  props: {
    test: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      sample: 1,
      slider: 0,
      darkModeSwitch: false
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
  },
  methods: {
  }
}
</script>

<style scoped>

  /*overflow: auto;*/
  /*overflow-y: hidden;*/
</style>
