<script>
import log from "loglevel";
import { defineComponent } from "vue";

import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/vue";
import Menu from "./components/Menu.vue";

const name = "App";
const LOG = `[component|${name}]`;

export default defineComponent({
  name,
  components: {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    Menu,
  },
  setup() {
    log.debug(LOG, "setup");
    return {};
  },
});
</script>

<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <Menu />
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
  </ion-app>
</template>

<style scoped></style>
