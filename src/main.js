import Vue from 'vue'
import App from './App.vue'
import WebRTC from 'vue-webrtc'
import Ads from 'vue-google-adsense'
import './index.css'
Vue.use(require('vue-script2'))

Vue.use(Ads.Adsense)
Vue.use(WebRTC)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
