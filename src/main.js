import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import '.firebase';

Vue.config.productionTip = false
import VueFire from 'vuefire';

Vue.use(VueFire);

new Vue({
  render: h => h(App)
}).$mount('#app')
