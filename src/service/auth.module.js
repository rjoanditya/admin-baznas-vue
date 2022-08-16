import jwtService from "./jwt.service";

export const SET_AUTH = "SET_AUTH";
export const PURGE_AUTH = "logOut";

export const state = {
  user: {},
  isAuthenticated: !!jwtService.getID()
};

const getters = {
  isAuthenticated(state){
    return state.isAuthenticated;
  }
};

const mutations = {
  [SET_AUTH](state, user){
    state.isAuthenticated = true;
    state.user = user;
    jwtService.setID(state.user.id);
    jwtService.setName(state.user.name);
    jwtService.setRole(state.user.is_admin);
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    jwtService.destroyID();
    jwtService.destroyName();
    jwtService.destroyRole();
  }
};

export default {
  state,
  mutations,
  getters
}