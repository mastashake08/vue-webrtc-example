import Vue from 'vue'
import App from './App.vue'
import WebRTC from 'vue-webrtc'

Vue.use(WebRTC)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
