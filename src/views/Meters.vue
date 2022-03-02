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
  onIonViewWillEnter,
} from "@ionic/vue";

import { add as addIcon } from "ionicons/icons";
import { ref, onMounted } from "vue";
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

    let shouldReloadData = false;

    const loading = ref(false);
    const router = useRouter();
    const items = ref([]);

    const retrierOptions = {
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
    const retrier = new Retrier(retrierOptions);

    const showLoading = () => store.dispatch("app/showLoading");
    const hideLoading = () => store.dispatch("app/hideLoading");

    showLoading();

    onMounted(async () => {
      log.debug(LOG, "view mounted");
      tryLoadData();
    });

    onIonViewWillEnter(async () => {
      if (!shouldReloadData) return;
      log.debug(LOG, "view will enter");
      await showLoading();
    });

    onIonViewDidEnter(async () => {
      if (!shouldReloadData) return;
      log.debug(LOG, "view did enter");
      tryLoadData();
      shouldReloadData = false;
    });

    const tryLoadData = () => {
      retrier
        .resolve((attempt) => loadData(attempt))
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
    };

    const loadData = async (attempt) => {
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
      shouldReloadData = true;
    };

    const openMeter = (item) => {
      log.debug(LOG, "open meter", { item });
      router.push(`/meters/${item.id}`);
      shouldReloadData = true;
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
