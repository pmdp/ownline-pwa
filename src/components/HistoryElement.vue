<template>
  <v-list-item ripple dense three-line @click.stop="onClick">
    <v-list-item-avatar>
      <!--<v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>-->
      <v-img :src="'/img/services/' + service.image"></v-img>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ service.name }} - {{ element.terminated ? 'TERMINATED' : 'RUNNING' }}</v-list-item-title>
      <v-list-item-subtitle>From <code>{{ element.trusted_ip }}</code> to port <code>{{ element.port_dst }}</code></v-list-item-subtitle>
      <v-list-item-subtitle>For {{ element.duration }} minutes, until: {{ new Date(element.end_timestamp*1000).toUTCString() }}</v-list-item-subtitle>
      <v-list-item-subtitle>ID: {{ element.public_id }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HistoryElement',
  props: {
    element: { type: Object, required: true }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'serviceById'
    ]),
    service () {
      return this.serviceById(this.element.service_id)
    }
  },
  methods: {
    onClick () {
      console.log('clicked')
      this.loading = true
      // this.$store.dispatch()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
