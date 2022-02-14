<script>
import log from "loglevel";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
} from "@ionic/vue";
import { defineComponent } from "vue";

const name = "Meters";
const LOG = `[component|${name}]`;

export default defineComponent({
  name,
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonButtons,
  },
  setup() {
    log.debug(LOG, "setup");
  },
});
</script>

<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="menu" color="dark" />
        </ion-buttons>
        <ion-title>Meters</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <span></span>
    </ion-content>
  </ion-page>
</template>
