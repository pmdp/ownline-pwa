<template>
  <div>
  <v-row align="top" justify="center" dense>
    <v-col md="6" s="12">
      <active-sessions-list class=""></active-sessions-list>
    </v-col>
<!--    <v-col md="6" s="12">-->
<!--      <invitations-list class=""></invitations-list>-->
<!--    </v-col>-->
  </v-row>
  <v-row align="top" justify="center" dense>
    <v-col cols="12" md="6">
      <services-list class=""></services-list>
    </v-col>
    <v-col cols="12" md="6">
      <history-list class=""></history-list>
    </v-col>
  </v-row>
  </div>
</template>

<script>
import ServicesList from '@/components/services/ServicesList'
import HistoryList from '@/components/HistoryList'
import ActiveSessionsList from '@/components/sessions/ActiveSessionsList'
// import InvitationsList from '@/components/invitations/InvitationsList'

export default {
  name: 'Dashboard',
  components: {
    ServicesList,
    ActiveSessionsList,
    HistoryList
    // InvitationsList
  },
  mounted () {
    console.log('Dashboard module started')
    // this.$store.dispatch(CHECK_AUTH)
  },
  data () {
    return {
      test: true,
      lorem: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .margin {
    margin-right: 16px;
  }
</style>
