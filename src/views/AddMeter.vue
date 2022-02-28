<script>
import log from "loglevel";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonFooter,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
} from "@ionic/vue";

import { useRouter } from "vue-router";
import { ref } from "vue";

import repo from "../db/repo/meters";

import useSQLite from "../composables/useSQLite";

const name = "Meter";
const LOG = `[component|${name}]`;

export default {
  name,
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButton,
    IonButtons,
    IonFooter,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
  },
  setup() {
    log.debug(LOG, "setup");

    const router = useRouter();
    const { ready, run } = useSQLite();

    const name = ref("");
    const no = ref("");
    const unit = ref("");
    const startValue = ref();
    const description = ref("");

    const saveItem = async () => {
      const { add } = repo;
      try {
        await run(
          add({
            name: name.value,
            no: no.value,
            unit: unit.value,
            startValue: startValue.value,
            description: description.value,
            user: "app",
          })
        );
        router.replace("/meters");
      } catch (ex) {
        log.error(ex);
      }

      log.debug("saved");
    };

    return {
      ready,
      name,
      no,
      unit,
      startValue,
      description,
      saveItem,
    };
  },
};
</script>

<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/meters" />
        </ion-buttons>
        <ion-title>Meter</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreens>
      <form>
        <ion-list lines="full" class="ion-margin">
          <ion-item>
            <ion-label position="stacked">Name</ion-label>
            <ion-input required v-model="name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">No</ion-label>
            <ion-input v-model="no"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Unit</ion-label>
            <ion-input v-model="unit"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Start value</ion-label>
            <ion-input type="number" v-model="startValue"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Description</ion-label>
            <ion-input required v-model="description"></ion-input>
          </ion-item>
          <section class="mt">
            <ion-button :disabled="!ready" expand="block" @click="saveItem"
              >Save</ion-button
            >
          </section>
        </ion-list>
      </form>
    </ion-content>

    <ion-footer></ion-footer>
  </ion-page>
</template>

<style scoped>
.mt {
  margin-top: 20px;
}
</style>
