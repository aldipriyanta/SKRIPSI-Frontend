import { createRouter, createWebHistory } from 'vue-router';
import DaftarMobil from '../views/DaftarMobil.vue';
import DetailMobil from '../views/DetailMobil.vue';
import Login from '../views/admin/Login.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import MobilForm from '../views/admin/MobilForm.vue';

const routes = [
  { path: '/', name: 'daftar-mobil', component: DaftarMobil },
  { path: '/mobil/:id', name: 'detail-mobil', component: DetailMobil },
  { path: '/admin/login', name: 'admin-login', component: Login },
  { path: '/admin', name: 'admin-dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/admin/mobil/tambah', name: 'admin-mobil-tambah', component: MobilForm, meta: { requiresAuth: true } },
  { path: '/admin/mobil/:id', name: 'admin-mobil-edit', component: MobilForm, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token');
  if (to.meta.requiresAuth && !token) {
    return { name: 'admin-login' };
  }
});
//asd
export default router;