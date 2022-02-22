<script>
import log from "loglevel";
import { ref } from "vue";

import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/vue";
import Menu from "./components/Menu.vue";
import SplashScreen from "./views/SplashScreen.vue";

const name = "App";
const LOG = `[component|${name}]`;

export default {
  name,
  components: {
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    Menu,
    SplashScreen,
  },
  setup() {
    log.debug(LOG, "setup");

    const showSplashScreen = ref(true);

    const onSplashScreenFadeout = () => {
      log.debug("splash-screen fadeout");
      showSplashScreen.value = false;
    };

    return {
      showSplashScreen,
      onSplashScreenFadeout,
    };
  },
};
</script>

<template>
  <ion-app>
    <SplashScreen v-if="showSplashScreen" @fadeout="onSplashScreenFadeout" />
    <ion-split-pane v-else content-id="main-content">
      <Menu />
      <ion-router-outlet id="main-content" />
    </ion-split-pane>
  </ion-app>
</template>

<style scoped></style>
