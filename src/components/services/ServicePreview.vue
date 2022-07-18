<template>
<!--  <div class="service-preview elevation-5" @click.stop="onClick">-->
<!--      <v-img class="image" width="100%" :src="'/img/services/' + service.image" />-->
<!--      <div class="name text-xs-center" v-text="service.name"></div>-->
<!--      <div id="serviceDisabled"></div>-->
<!--      <div id="loadingFeedback" class="feedback-container" v-show="loading">-->
<!--        <v-progress-circular indeterminate :size="50"></v-progress-circular>-->
<!--      </div>-->
<!--      <div id="successFeedback" class="feedback-container">-->
<!--        &lt;!&ndash;<iron-icon class="big-iron-icon" icon="icons:check" style="color: green"></iron-icon>&ndash;&gt;-->
<!--      </div>-->
<!--      <div id="errorFeedback" class="feedback-container">-->
<!--        &lt;!&ndash;<iron-icon class="big-iron-icon" icon="icons:error-outline" style="color: red"></iron-icon>&ndash;&gt;-->
<!--      </div>-->
<!--  </div>-->

  <v-card outlined title class="service-preview pa-2" @click.stop="onClick">
    <v-tooltip v-if="currentServiceCheck" bottom>
      <template v-slot:activator="{ on }">
        <v-badge v-on="on" class="sessionIndicator" icon="mdi-atom-variant"></v-badge>
      </template>
      <span>Current session to this service</span>
    </v-tooltip>
    <v-img
      :src="'/img/services/' + service.image"
      width="100%"
    ></v-img>
    <v-card-title class="justify-center text-no-wrap">{{ service.name }}</v-card-title>
    <!--<v-card-actions>-->
      <!--<v-btn-->
        <!--icon-->
        <!--@click="show = !show"-->
      <!--&gt;-->
        <!--<v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>-->
      <!--</v-btn>-->
    <!--</v-card-actions>-->
    <!--<v-expand-transition>-->
      <!--<div v-show="show">-->
        <!--<v-divider></v-divider>-->

        <!--<v-card-text>-->
          <!--I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.-->
        <!--</v-card-text>-->
      <!--</div>-->
    <!--</v-expand-transition>-->
    <!--<div id="serviceDisabled"></div>-->
    <!--<div id="loadingFeedback" class="feedback-container" v-show="loading">-->
      <!--<v-progress-circular indeterminate :size="50"></v-progress-circular>-->
    <!--</div>-->
    <!--<div id="successFeedback" class="feedback-container">-->
      <!--&lt;!&ndash;<iron-icon class="big-iron-icon" icon="icons:check" style="color: green"></iron-icon>&ndash;&gt;-->
    <!--</div>-->
    <!--<div id="errorFeedback" class="feedback-container">-->
      <!--&lt;!&ndash;<iron-icon class="big-iron-icon" icon="icons:error-outline" style="color: red"></iron-icon>&ndash;&gt;-->
    <!--</div>-->
  </v-card>
</template>

<script>
import { SHOW_SERVICE_DIALOG } from '@/store/actions.type'
import { mapGetters } from 'vuex'

export default {
  name: 'ServicePreview',
  props: {
    service: { type: Object, required: true }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'publicIp',
      'activeSessions',
      'hostName'
    ]),
    // a computed getter
    imageSize: function () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '100px'
        case 'sm': return '75px'
        case 'md': return '100px'
        case 'lg': return '100px'
        case 'xl': return '150px'
        default: return '100px'
      }
    },
    currentServiceCheck: function () {
      return this.activeSessions.find(s => s.service_id === this.service.public_id)
    }
  },
  methods: {
    onClick () {
      console.log(this.service)
      const dialogData = {
        title: `${this.service.name}`,
        service: this.service
      }
      this.$store.dispatch(SHOW_SERVICE_DIALOG, dialogData)
    },
    onHover () {
      console.log(this)
    }
  }
}
</script>

<style lang="scss">
  .service-preview {
    /*display: block;*/
    /*position:relative;*/
    /*cursor: pointer;*/
    /*border-radius: 5px;*/
    /*padding: 5px;*/
    /*width: calc(50% - 50px);*/
    /*margin: 5px;*/

    /*color: #757575;

    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    min-width: 70px;*/

    #serviceDisabled {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.5;
      border-radius: 5px;
      text-align: center;
      visibility: hidden;
    }

    .feedback-container > * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &:hover {
      box-shadow: 0px 6px 6px -3px rgba(0,0,0,0.2), 0px 10px 14px 1px rgba(0,0,0,0.14), 0px 4px 18px 3px rgba(0,0,0,0.12) !important;
    }

    .sessionIndicator {
      position: relative;
      top: 0;
      left: 0;
    }
  }
</style>
