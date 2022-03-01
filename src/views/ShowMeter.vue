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
  onIonViewDidEnter,
} from "@ionic/vue";

import { useRouter } from "vue-router";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import repo from "../db/repo/meters";

import useSQLite from "../composables/useSQLite";
import { Retrier } from "@jsier/retrier";

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
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    log.debug(LOG, "setup");

    useI18n();
    const router = useRouter();
    const { ready, querySingle } = useSQLite();

    const name = ref("");
    const no = ref("");
    const unit = ref("");
    const startValue = ref();
    const description = ref("");

    onIonViewDidEnter(async () => {
      log.debug(LOG, "view did enter");

      const options = {
        limit: 5,
        firstAttemptDelay: 500,
        delay: 250,
        keepRetryingIf: !ready.value,
      };

      const retrier = new Retrier(options);
      retrier.resolve(load).then(
        () => log.debug(LOG, "data loaded"),
        () => log.debug(LOG, "load data failed")
      );
    });

    const load = async () => {
      if (!ready.value) {
        log.debug(LOG, "db not ready");
        return Promise.reject(new Error("fail to load data"));
      }

      log.debug(LOG, "query db");
      const { name, no, unit, startValue, description } = await querySingle(
        repo.getById({ id: parseInt(props.id) })
      );
      log.debug(LOG, {
        name,
        no,
        unit,
        startValue,
        description,
      });

      name.value = name;
      no.value = no;
      unit.value = unit;
      startValue.value = startValue;
      description.value = description;
    };

    const save = () => {
      log.debug(LOG, "saving");
      router.back();
    };

    return {
      ready,
      name,
      no,
      unit,
      startValue,
      description,
      save,
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
        <ion-title v-t="{ path: 'AddMeter.page-title' }" />
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreens>
      <form>
        <ion-list lines="full" class="ion-margin">
          <ion-item>
            <ion-label position="stacked" v-t="'AddMeter.label-name'" />
            <ion-input readonly required v-model="name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" v-t="'AddMeter.label-no'" />
            <ion-input readonly v-model="no"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" v-t="'AddMeter.label-unit'" />
            <ion-input readonly v-model="unit"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" v-t="'AddMeter.label-start-value'" />
            <ion-input readonly type="number" v-model="startValue"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked" v-t="'AddMeter.label-description'" />
            <ion-input required v-model="description"></ion-input>
          </ion-item>
          <section class="mt">
            <ion-button
              :disabled="!ready"
              expand="block"
              @click="save"
              v-t="'AddMeter.button-save'"
            />
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
