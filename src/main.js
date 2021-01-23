import { createApp } from 'vue';
import App from './App.vue';
import mitt from 'mitt';

// Init EventHandler
const EventHandler = mitt();

const app = createApp(App);

app.config.globalProperties.EventHandler = EventHandler;

app.mount("#app");
