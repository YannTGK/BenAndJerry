import { createRouter, createWebHistory } from 'vue-router';
import CustomizePage from '@/pages/CustomizePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import AdminPage from '@/pages/AdminPage.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',      component: CustomizePage },
    { path: '/login', component: LoginPage   },
    { path: '/admin', component: AdminPage   },
  ],
});