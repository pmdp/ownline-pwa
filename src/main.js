import Vue from 'vue'
import './plugins/axios'
import Root from './Root.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { CHECK_AUTH } from '@/store/actions.type'

Vue.config.productionTip = false

router.beforeEach(
  (to, from, next) => {
    return Promise
      .all([store.dispatch(CHECK_AUTH)])
      .then(next)
  }
)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(Root)
}).$mount('#app')
