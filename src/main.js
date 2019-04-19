import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import './firebase';
import { firestorePlugin } from 'vuefire'

var firebase = require('firebase');
require('firebase/firestore');

Vue.config.productionTip = false

Vue.use(firestorePlugin);

new Vue({
  render: h => h(App)
}).$mount('#app')
