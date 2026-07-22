<template>
  <div class="page">
    <header class="admin-topbar">
      <div class="container topbar-inner">
        <span class="brand">ARJUNA MOTOR · ADMIN</span>
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </header>

    <main class="container">
      <div class="header-row">
        <h1>Kelola Data Mobil</h1>
        <RouterLink to="/admin/mobil/tambah" class="btn-primary">+ Tambah Mobil</RouterLink>
      </div>

      <div v-if="loading" class="state-text">Memuat data...</div>
      <table v-else class="admin-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Merek</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mobil in daftarMobil" :key="mobil.id_mobil">
            <td>{{ mobil.nama_mobil }}</td>
            <td>{{ mobil.Merek?.nama_merek }}</td>
            <td>{{ mobil.Kategori?.nama_kategori }}</td>
            <td>Rp {{ formatHarga(mobil.harga) }}</td>
            <td>{{ mobil.status_stok }}</td>
            <td class="actions">
              <RouterLink :to="`/admin/mobil/${mobil.id_mobil}`">Edit</RouterLink>
              <button @click="hapusMobil(mobil.id_mobil)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';
import { useAuth } from '../../composables/useAuth';

const daftarMobil = ref([]);
const loading = ref(true);
const router = useRouter();
const { logout } = useAuth();

function formatHarga(angka) {
  return new Intl.NumberFormat('id-ID').format(angka);
}

async function muatData() {
  loading.value = true;
  const res = await api.get('/mobil');
  const data = Array.isArray(res.data.data) ? res.data.data : [];
  daftarMobil.value = [...data].sort((a, b) => b.id_mobil - a.id_mobil);
  loading.value = false;
}

async function hapusMobil(id) {
  if (!confirm('Yakin hapus data mobil ini?')) return;
  await api.delete(`/mobil/${id}`);
  await muatData();
}   

function handleLogout() {
  logout();
  router.push('/admin/login');
}

onMounted(muatData);
</script>
<!-- asd -->
<style scoped>
.admin-topbar {
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
}

.topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-family: var(--font-display);
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 1px;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 20px;
}

.header-row h1 {
  font-size: 28px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #191207;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 14px;
  box-shadow: var(--shadow-glow);
}

.state-text {
  color: var(--text-muted);
  padding: 40px 0;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 60px;
}

.admin-table th,
.admin-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.admin-table th {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions a {
  color: var(--accent);
}

.actions button {
  background: none;
  border: none;
  color: var(--terjual);
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}
</style>