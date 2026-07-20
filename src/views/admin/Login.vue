<template>
  <div class="login-page">
    <form class="login-box" @submit.prevent="handleLogin">
      <h1>Login Admin</h1>
      <p class="subtitle">Arjuna Motor</p>

      <label>Username</label>
      <input v-model="username" type="text" required />

      <label>Password</label>
      <input v-model="password" type="password" required />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="loading">{{ loading ? 'Memproses...' : 'Login' }}</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const username = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);
const router = useRouter();
const { login } = useAuth();

async function handleLogin() {
  error.value = null;
  loading.value = true;
  try {
    await login(username.value, password.value);
    router.push('/admin');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-box {
  width: 320px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 32px;
}
.login-box h1 { font-size: 26px; }
.subtitle { color: var(--text-muted); font-size: 13px; margin: 0 0 20px; }
label { display: block; font-size: 13px; color: var(--text-muted); margin: 14px 0 6px; }
input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
}
.error { color: var(--terjual); font-size: 13px; margin-top: 12px; }
button {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: var(--accent);
  color: var(--bg);
  font-weight: 600;
  cursor: pointer;
}
button:disabled { opacity: 0.6; cursor: not-allowed; }
</style>