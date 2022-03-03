import log from "loglevel";

import { defineStore } from "pinia";
import { version, displayName } from "../../package.json";

const id = "app";
const LOG = `[store.${id}]`;

export const useAppStore = defineStore(id, {
  state() {
    return {
      multiselect: false,
      loading: false,
      version,
      name: displayName,
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
