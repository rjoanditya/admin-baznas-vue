import Vue from 'vue'
import router from './router'
import API from './service/axios'
import Vuelidate from "vuelidate";
import VueSweetalert2 from 'vue-sweetalert2';
import Multiselect from 'vue-multiselect';
import store from "@/service/store";
import Toggle from "@vueform/toggle/dist/toggle.vue2";
import BootstrapVue from "bootstrap-vue"

import App from './App'

import Default from './Layout/Wrappers/baseLayout.vue';
import Pages from './Layout/Wrappers/pagesLayout.vue';

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(Multiselect);

Vue.use(VueSweetalert2);

import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import '@vueform/toggle/themes/default.css'

Vue.prototype.$api = API;

Vue.component('default-layout', Default);
Vue.component('userpages-layout', Pages);
Vue.component('multiselect', Multiselect);
Vue.component('toggle', Toggle);

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
