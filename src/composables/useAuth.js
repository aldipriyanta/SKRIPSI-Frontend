import { ref } from 'vue';
import api from '../api/axios';

const token = ref(localStorage.getItem('admin_token') || null);
const admin = ref(JSON.parse(localStorage.getItem('admin_data') || 'null'));

async function login(username, password) {
  const res = await api.post('/auth/login', { username, password });
  token.value = res.data.token;
  admin.value = res.data.admin;
  localStorage.setItem('admin_token', token.value);
  localStorage.setItem('admin_data', JSON.stringify(admin.value));
}

function logout() {
  token.value = null;
  admin.value = null;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_data');
}
//asd
export function useAuth() {
  return { token, admin, login, logout };
}