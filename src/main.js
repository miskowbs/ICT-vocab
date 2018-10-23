import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './firebase';
import VueFire from 'vuefire';

var firebase = require('firebase');
Vue.config.productionTip = false

Vue.use(VueFire);

new Vue({
  render: h => h(App)
}).$mount('#app')
