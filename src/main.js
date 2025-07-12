import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';       // je eigen css / tailwind

createApp(App).use(router).mount('#app');