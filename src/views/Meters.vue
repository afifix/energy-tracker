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
  IonFooter,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  onIonViewDidEnter,
} from "@ionic/vue";

import { add as addIcon } from "ionicons/icons";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Retrier } from "@jsier/retrier";

import useSQLite from "../composables/useSQLite";
import repo from "../db/repo/meters";

const name = "Meters";
const LOG = `[component|${name}]`;

export default {
  name,
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonButtons,
    IonFooter,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
  },
  setup() {
    log.debug(LOG, "setup");

    useI18n();
    const store = useStore();
    const { ready, query } = useSQLite();
    const loading = ref(false);
    const router = useRouter();
    const items = ref([]);

    const showLoading = () => store.dispatch("app/showLoading");
    const hideLoading = () => store.dispatch("app/hideLoading");

    showLoading();

    onIonViewDidEnter(async () => {
      log.debug(LOG, "view did enter");
      const options = {
        limit: 5,
        firstAttemptDelay: 0,
        delay: 250,
        keepRetryingIf: (response, attempt) => {
          log.debug(LOG, "keepRetryingIf", {
            response,
            attempt,
          });
          return !ready.value;
        },
      };

      const retrier = new Retrier(options);
      retrier
        .resolve((attempt) => load(attempt))
        .then(
          async () => {
            log.debug(LOG, "data loaded");
            await hideLoading();
          },
          async () => {
            log.debug(LOG, "load data failed");
            await hideLoading();
          }
        );
    });

    const load = async (attempt) => {
      log.debug(LOG, "load meters", { attempt });
      if (!ready.value) throw new Error("fail to load data");

      try {
        const data = await query(repo.getAll());
        items.value = data;
      } catch (err) {
        log.error(err.message);
        throw err;
      }
    };

    const refresh = () => {
      log.debug(LOG, "refresh");
    };

    const toNewMeterPage = () => {
      log.debug(LOG, "new meter");
      router.push("/meters/add");
    };

    const openMeter = (item) => {
      log.debug(LOG, "open meter", { item });
      router.push(`/meters/${item.id}`);
    };

    return {
      ready,
      refresh,
      toNewMeterPage,
      openMeter,
      addIcon,
      loading,
      items,
    };
  },
};
</script>

<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button menu="menu" color="dark" />
        </ion-buttons>
        <ion-title v-t="'Meters.page-title'" />
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreens>
      <ion-refresher slot="fixed" :hidden="!loading" @ionRefresh="refresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list lines="full">
        <ion-item
          button
          @click="openMeter(item)"
          v-for="item in items"
          :key="item.id"
        >
          <ion-label>{{ item.name }}</ion-label>
        </ion-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button
          :disabled="!ready"
          color="primary"
          @click="toNewMeterPage"
        >
          <ion-icon :icon="addIcon" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <ion-footer></ion-footer>
  </ion-page>
</template>
