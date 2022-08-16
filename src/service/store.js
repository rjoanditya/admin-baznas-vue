import Vue from "vue";
import Vuex from "vuex";
import jwtService from "./jwt.service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    isAuthenticated: !!jwtService.getID()
  },
  getters: {
    isAuthenticated(state){
      return state.isAuthenticated;
    }
  },
  mutations: {
    setAuth(state, user){
      state.isAuthenticated = true;
      state.user = user;
      jwtService.saveID(state.user.id);
      jwtService.saveEmail(state.user.email);
      jwtService.saveRole(state.user.is_admin);
      jwtService.saveName(state.user.first_name);
      jwtService.saveVG(JSON.stringify(state.user.group_view));
      jwtService.saveVC(JSON.stringify(state.user.category_view));
    },
    purgeAuth(state) {
      state.isAuthenticated = false;
      state.user = {};
      jwtService.destroyID();
      jwtService.destroyRole();
      jwtService.destroyName();
      jwtService.destroyEmail();
      jwtService.destroyVG();
      jwtService.destroyVC();
    }
  },
  actions: {}
});