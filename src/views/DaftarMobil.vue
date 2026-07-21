<template>
  <div class="page">
    <header class="topbar">
      <div class="container topbar-inner">
        <span class="brand">ARJUNA MOTOR</span>
        <span class="tagline">Showroom Mobil Bekas Terpercaya</span>
      </div>
    </header>

    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <h1>Temukan mobil bekas<br />yang siap jalan hari ini.</h1>
          <p>Semua unit sudah diperiksa, harga transparan, tinggal tanya chatbot kalau ragu.</p>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-number">{{ jumlahTersedia }}</span>
          <span class="hero-stat-label">Unit tersedia sekarang</span>
        </div>
      </div>
    </section>

    <main class="container">
      <div class="filter-row">
        <button
          class="chip"
          :class="{ active: filterKategori === null }"
          @click="filterKategori = null"
        >
          Semua
        </button>
        <button
          v-for="kategori in daftarKategoriUnik"
          :key="kategori"
          class="chip"
          :class="{ active: filterKategori === kategori }"
          @click="filterKategori = kategori"
        >
          {{ kategori }}
        </button>
      </div>

      <div v-if="loading" class="state-text">Memuat data mobil...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>
      <div v-else-if="mobilTersaring.length === 0" class="state-text">
        Belum ada mobil di kategori ini.
      </div>

      <div v-else class="grid">
        <RouterLink
          v-for="mobil in mobilTersaring"
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
            <span class="card-cta">Lihat Detail &rarr;</span>
          </div>
        </RouterLink>
      </div>
    </main>
  </div>
</template>
<!-- asd -->
<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api/axios';
import {useChatbot} from '../composables/useChatbot';

const daftarMobil = ref([]);
const loading = ref(true);
const error = ref(null);
const filterKategori = ref(null);
const apiOrigin = (import.meta.env.VITE_API_BASE_URL || '').replace('/api', '');
const { bukaDenganPertanyaan } = useChatbot();

const jumlahTersedia = computed(
  () => daftarMobil.value.filter((m) => m.status_stok === 'tersedia').length
);

const daftarKategoriUnik = computed(() => {
  const set = new Set(daftarMobil.value.map((m) => m.Kategori?.nama_kategori).filter(Boolean));
  return [...set];
});

const mobilTersaring = computed(() => {
  if (!filterKategori.value) return daftarMobil.value;
  return daftarMobil.value.filter((m) => m.Kategori?.nama_kategori === filterKategori.value);
});

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
.topbar { border-bottom: 1px solid var(--border); padding: 20px 0; }
.topbar-inner { display: flex; align-items: baseline; gap: 12px; }
.brand { font-family: var(--font-display); font-size: 22px; font-weight: 700; letter-spacing: 1px; color: var(--accent); }
.tagline { font-size: 13px; color: var(--text-muted); }

.hero {
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--border);
  padding: 56px 0;
}
.hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}
.hero-text h1 {
  font-size: 42px;
  line-height: 1.1;
  max-width: 480px;
}
.hero-text p {
  color: var(--text-muted);
  margin-top: 12px;
  max-width: 420px;
}
.hero-stat {
  text-align: center;
  border-left: 2px solid var(--accent);
  padding-left: 28px;
}
.hero-stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}
.hero-stat-label {
  font-size: 13px;
  color: var(--text-muted);
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 32px 0 24px;
}
.chip {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.chip:hover { border-color: var(--accent); color: var(--text); }
.chip.active { background: var(--accent); border-color: var(--accent); color: var(--bg); font-weight: 600; }

.state-text { color: var(--text-muted); padding: 40px 0; }
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
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
}

.card-image { position: relative; aspect-ratio: 4 / 3; background: #16171a; }
.card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-image-placeholder {
  display: flex; align-items: center; justify-content: center; height: 100%;
  color: var(--text-muted); font-size: 13px;
}

.plate {
  position: absolute; bottom: 10px; left: 10px;
  font-family: var(--font-display); font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
  padding: 3px 10px; border-radius: 4px; border: 1.5px solid; background: var(--bg);
}
.plate-tersedia { color: var(--tersedia); border-color: var(--tersedia); }
.plate-terjual { color: var(--terjual); border-color: var(--terjual); }

.card-body { padding: 14px 16px 16px; }
.card-body h3 { font-size: 20px; }
.card-meta { color: var(--text-muted); font-size: 13px; margin: 4px 0 10px; }
.card-price { color: var(--accent); font-size: 17px; font-weight: 600; margin: 0 0 8px; }
.card-cta {
  display: inline-block; font-size: 13px; color: var(--text-muted);
  border-top: 1px solid var(--border); padding-top: 10px; width: 100%;
  transition: color 0.15s ease;
}
.card:hover .card-cta { color: var(--accent); }

.cta-tanya {
  margin-top: 20px;
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
.cta-tanya:hover { background: var(--accent); color: var(--bg); }
</style>