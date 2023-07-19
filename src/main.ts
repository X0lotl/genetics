import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';

import "primevue/resources/themes/arya-purple/theme.css";
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config';

import Button from "primevue/button";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';


const app = createApp(App);
app.use(PrimeVue);

app.component("InputText", InputText);
app.component('Button', Button);
app.component('Dropdown', Dropdown);

app.mount("#app");
