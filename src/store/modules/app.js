import log from "loglevel";

import { SET_APP_MULTISELECT, SET_APP_LOADING } from "../mutation-types";
import { version, displayName } from "../../../package.json";

const name = "app";
const LOG = `[STORE|${name}]`;

const state = {
  multiselect: false,
  loading: false,
  version,
  name: displayName,
};

const actions = {
  enableMultiselect({ commit }) {
    log.debug(LOG, "[A|enableMultiselect]");
    return new Promise((resolve) => {
      commit(SET_APP_MULTISELECT, true);
      resolve();
    });
  },
  disableMultiselect({ commit }) {
    log.debug(LOG, "[A|disableMultiselect]");
    return new Promise((resolve) => {
      commit(SET_APP_MULTISELECT, false);
      resolve();
    });
  },
  showLoading({ commit }) {
    log.debug(LOG, "[A|showLoading]");
    return new Promise((resolve) => {
      commit(SET_APP_LOADING, true);
      resolve();
    });
  },
  hideLoading({ commit }) {
    log.debug(LOG, "[A|hideLoading]");
    return new Promise((resolve) => {
      commit(SET_APP_LOADING, false);
      resolve();
    });
  },
};

const mutations = {
  [SET_APP_MULTISELECT](state, val) {
    log.debug(LOG, `[M|${SET_APP_MULTISELECT}]`, { multiselect: val });
    state.multiselect = val;
  },
  [SET_APP_LOADING](state, val) {
    log.debug(LOG, `[M|${SET_APP_LOADING}]`, { loading: val });
    state.loading = val;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
