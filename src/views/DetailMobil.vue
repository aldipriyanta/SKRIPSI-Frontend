<template>
  <div class="page">
    <header class="topbar">
      <div class="container">
        <RouterLink to="/" class="back-link">&larr; Kembali ke daftar mobil</RouterLink>
      </div>
    </header>

    <main class="container">
      <div v-if="loading" class="state-text">Memuat detail mobil...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>

      <div v-else class="detail">
        <div class="gallery">
          <img
            v-if="gambarUtama"
            :src="`${apiOrigin}${gambarUtama}`"
            :alt="mobil.nama_mobil"
            class="gallery-main"
          />
          <div v-else class="gallery-placeholder">Belum ada foto</div>
        </div>

        <div class="info">
          <span class="plate" :class="mobil.status_stok === 'tersedia' ? 'plate-tersedia' : 'plate-terjual'">
            {{ mobil.status_stok === 'tersedia' ? 'TERSEDIA' : 'TERJUAL' }}
          </span>

          <h1>{{ mobil.nama_mobil }}</h1>
          <p class="price">Rp {{ formatHarga(mobil.harga) }}</p>

          <table class="specs">
            <tbody>
              <tr><td>Merek</td><td>{{ mobil.Merek?.nama_merek }}</td></tr>
              <tr><td>Kategori</td><td>{{ mobil.Kategori?.nama_kategori }}</td></tr>
              <tr><td>Tipe</td><td>{{ mobil.tipe || '-' }}</td></tr>
              <tr><td>Tahun</td><td>{{ mobil.tahun || '-' }}</td></tr>
              <tr><td>Transmisi</td><td>{{ mobil.transmisi || '-' }}</td></tr>
              <tr><td>Bahan Bakar</td><td>{{ mobil.bahan_bakar || '-' }}</td></tr>
              <tr><td>Kilometer</td><td>{{ mobil.kilometer ? formatHarga(mobil.kilometer) + ' km' : '-' }}</td></tr>
            </tbody>
          </table>

          <p class="deskripsi">{{ mobil.deskripsi || 'Tidak ada deskripsi tambahan.' }}</p>

          <button class="cta-tanya" @click="bukaDenganPertanyaan(`Ceritakan lebih detail soal ${mobil.nama_mobil}`)">
            Tanya soal mobil ini ke chatbot
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
<!-- asd -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';
import { useChatbot } from '../composables/useChatbot';

const route = useRoute();
const mobil = ref({});
const loading = ref(true);
const error = ref(null);
const apiOrigin = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');
const { bukaDenganPertanyaan, state } = useChatbot();

const gambarUtama = computed(() => mobil.value.GambarMobils?.[0]?.url_gambar);

function formatHarga(angka) {
  return new Intl.NumberFormat('id-ID').format(angka);
}

onMounted(async () => {
  try {
    const res = await api.get(`/mobil/${route.params.id}`);
    mobil.value = res.data.data;
    state.terbuka = true;
  } catch (err) {
    error.value = 'Mobil tidak ditemukan atau server backend tidak berjalan.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.topbar { border-bottom: 1px solid var(--border); padding: 20px 0; }
.back-link { color: var(--text-muted); font-size: 14px; }
.back-link:hover { color: var(--accent); }

.state-text { color: var(--text-muted); padding: 40px 0; }
.state-text.error { color: var(--terjual); }

.detail {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  padding: 40px 0 60px;
}
@media (max-width: 720px) {
  .detail { grid-template-columns: 1fr; }
}

.gallery-main {
  width: 100%;
  border-radius: 8px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}
.gallery-placeholder {
  aspect-ratio: 4 / 3;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.plate {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 4px 12px;
  border-radius: 4px;
  border: 1.5px solid;
  margin-bottom: 16px;
}
.plate-tersedia { color: var(--tersedia); border-color: var(--tersedia); }
.plate-terjual { color: var(--terjual); border-color: var(--terjual); }

.info h1 { font-size: 36px; margin-bottom: 8px; }
.price { color: var(--accent); font-size: 24px; font-weight: 600; margin: 0 0 24px; }

.specs { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
.specs td { padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 14px; }
.specs td:first-child { color: var(--text-muted); width: 140px; }

.deskripsi { color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }

.cta-tanya {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 1.5px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.cta-tanya:hover { background: var(--accent); color: #fff; }
</style>