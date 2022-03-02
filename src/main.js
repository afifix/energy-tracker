import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { IonicVue } from "@ionic/vue";

import log from "loglevel";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

// i18n
import { createI18n } from "vue-i18n";
import messages from "./locales";

const LOG = "[main]";
log.disableAll();
if (process.env.NODE_ENV === "development") {
  log.setLevel(0);
}
log.debug(LOG, "log", { level: log.getLevel() });

log.debug(LOG, "creating app...");
const app = createApp(App).use(IonicVue).use(router);

router.isReady().then(() => {
  log.debug(LOG, "router ready");
  app
    .use(
      createI18n({
        legacy: false,
        locale: "fr",
        messages,
      })
    )
    .use(store)
    .mount("#app");

  log.debug(messages);
});

// # move to javascript
// https://ionicframework.com/docs/vue/quickstart#build-your-way-with-typescript-or-javascript
