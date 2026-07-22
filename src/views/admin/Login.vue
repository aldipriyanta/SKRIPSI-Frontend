<template>
  <div class="login-page">
    <form class="login-box glass" @submit.prevent="handleLogin">
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
<!-- asd -->
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
  width: 340px;
  border-radius: var(--radius-lg);
  padding: 36px;
  box-shadow: var(--shadow-lg);
}
.login-box h1 { font-family: var(--font-display); font-size: 26px; }
.subtitle { color: var(--text-muted); font-size: 13px; margin: 0 0 22px; }
label { display: block; font-size: 13px; color: var(--text-muted); margin: 14px 0 6px; }
input {
  width: 100%;
  padding: 11px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--bg-soft);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s ease;
}
input:focus { border-color: var(--accent); }
.error { color: var(--terjual); font-size: 13px; margin-top: 12px; }
button {
  width: 100%;
  margin-top: 22px;
  padding: 12px;
  border-radius: var(--radius-sm);
  border: none;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #191207;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition: transform 0.2s ease;
}
button:hover:not(:disabled) { transform: translateY(-1px); }
button:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
</style>