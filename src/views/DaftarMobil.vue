<template>
  <div class="page">
    <header class="topbar">
      <div class="container topbar-inner">
        <span class="brand">ARJUNA MOTOR</span>
        <span class="tagline">Showroom Mobil Bekas Terpercaya</span>
      </div>
    </header>

    <main class="container">
      <h1 class="page-title">Daftar Mobil</h1>

      <div v-if="loading" class="state-text">Memuat data mobil...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>
      <div v-else-if="daftarMobil.length === 0" class="state-text">
        Belum ada mobil yang tersedia saat ini.
      </div>

      <div v-else class="grid">
        <RouterLink
          v-for="mobil in daftarMobil"
          :key="mobil.id_mobil"
          :to="`/mobil/${mobil.id_mobil}`"
          class="card"
        >
          <div class="card-image">
            <img
              v-if="mobil.GambarMobils && mobil.GambarMobils[0]"
              :src="`${apiOrigin}${mobil.GambarMobils[0].url_gambar}`"
              :alt="mobil.nama_mobil"
            />
            <div v-else class="card-image-placeholder">Belum ada foto</div>

            <span class="plate" :class="mobil.status_stok === 'tersedia' ? 'plate-tersedia' : 'plate-terjual'">
              {{ mobil.status_stok === 'tersedia' ? 'TERSEDIA' : 'TERJUAL' }}
            </span>
          </div>

          <div class="card-body">
            <h3>{{ mobil.nama_mobil }}</h3>
            <p class="card-meta">{{ mobil.Merek?.nama_merek }} · {{ mobil.Kategori?.nama_kategori }} · {{ mobil.tahun }}</p>
            <p class="card-price">Rp {{ formatHarga(mobil.harga) }}</p>
          </div>
        </RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';

const daftarMobil = ref([]);
const loading = ref(true);
const error = ref(null);
const apiOrigin = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

function formatHarga(harga) {
  return new Intl.NumberFormat('id-ID').format(harga);
}

onMounted(async () => {
  try {
    const res = await api.get('/mobil');
    daftarMobil.value = res.data.data;
  } catch (err) {
    error.value = 'Gagal memuat data mobil. Pastikan server backend sedang berjalan.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.topbar {
  border-bottom: 1px solid var(--border);
  padding: 20px 0;
}
.topbar-inner {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.brand {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--accent);
}
.tagline {
  font-size: 13px;
  color: var(--text-muted);
}

.page-title {
  font-size: 32px;
  margin: 40px 0 24px;
}

.state-text {
  color: var(--text-muted);
  padding: 40px 0;
}
.state-text.error { color: var(--terjual); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding-bottom: 60px;
}

.card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
}

.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #16171a;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 13px;
}

.plate {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1.5px solid;
  background: var(--bg);
}
.plate-tersedia { color: var(--tersedia); border-color: var(--tersedia); }
.plate-terjual { color: var(--terjual); border-color: var(--terjual); }

.card-body { padding: 14px 16px 16px; }
.card-body h3 { font-size: 20px; }
.card-meta { color: var(--text-muted); font-size: 13px; margin: 4px 0 10px; }
.card-price { color: var(--accent); font-size: 17px; font-weight: 600; margin: 0; }
</style>