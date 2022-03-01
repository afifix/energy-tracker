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
  onIonViewWillLeave,
} from "@ionic/vue";

import { add as addIcon } from "ionicons/icons";
import { ref } from "vue";
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
    const { ready, query } = useSQLite();
    const loading = ref(false);
    const router = useRouter();
    const items = ref([]);

    onIonViewDidEnter(async () => {
      log.debug(LOG, "view did enter");

      const options = {
        limit: 5,
        firstAttemptDelay: 500,
        delay: 250,
      };

      const retrier = new Retrier(options);
      retrier.resolve(load).then(
        () => log.debug(LOG, "data loaded"),
        () => log.debug(LOG, "load data failed")
      );
    });

    onIonViewWillLeave(() => {
      log.debug(LOG, "view will leave");
    });

    const load = async () => {
      if (!ready.value) return Promise.reject(new Error("fail to load data"));

      try {
        const data = await query(repo.getAll());
        items.value = data;
      } catch (err) {
        log.Error(err);
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
