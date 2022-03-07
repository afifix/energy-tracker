import log from "loglevel";

import { defineStore } from "pinia";

const id = "app";
const LOG = `[store.${id}]`;

export const useAppStore = defineStore(id, {
  state() {
    return {
      shouldReloadData: false,
      multiselect: false,
      loading: false,
      version: "0.1.0",
      name: "Energy Tracker",
    };
  },
  actions: {
    showLoading() {
      log.debug(LOG, "[A|showLoading]");
      this.loading = true;
    },
    hideLoading() {
      log.debug(LOG, "[A|hideLoading]");
      this.loading = false;
    },
    enableMultiselect() {
      log.debug(LOG, "[A|enableMultiselect]");
      this.multiselect = true;
    },
    disableMultiselect() {
      log.debug(LOG, "[A|disableMultiselect]");
      this.multiselect = false;
    },
  },
});
