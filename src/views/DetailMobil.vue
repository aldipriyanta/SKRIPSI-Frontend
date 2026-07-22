<template>
  <div class="page">
    <header class="topbar glass">
      <div class="container">
        <RouterLink to="/" class="back-link">&larr; Kembali ke daftar mobil</RouterLink>
      </div>
    </header>

    <main class="container">
      <div v-if="loading" class="state-text">Memuat detail mobil...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>

      <div v-else class="detail">
        <div class="gallery" @mousemove="(e) => tiltMove(e, 5)" @mouseleave="tiltLeave">
          <img v-if="gambarUtama" :src="`${apiOrigin}${gambarUtama}`" :alt="mobil.nama_mobil" class="gallery-main" />
          <div v-else class="gallery-placeholder">Belum ada foto</div>
          <div class="gallery-sheen"></div>
        </div>

        <div class="info glass">
          <span class="plate" :class="mobil.status_stok === 'tersedia' ? 'plate-tersedia' : 'plate-terjual'">
            {{ mobil.status_stok === 'tersedia' ? 'TERSEDIA' : 'TERJUAL' }}
          </span>

          <h1>{{ mobil.nama_mobil }}</h1>
          <p class="price">Rp {{ formatHarga(mobil.harga) }}</p>

          <div class="specs">
            <div class="spec-item">
              <span class="spec-label">Merek</span>
              <span class="spec-value">{{ mobil.nama_merek || '-' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Kategori</span>
              <span class="spec-value">{{ mobil.Kategori?.nama_kategori || '-' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Tipe</span>
              <span class="spec-value">{{ mobil.tipe || '-' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Tahun</span>
              <span class="spec-value">{{ mobil.tahun || '-' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Transmisi</span>
              <span class="spec-value">{{ mobil.transmisi || '-' }}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Bahan Bakar</span>
              <span class="spec-value">{{ mobil.bahan_bakar || '-' }}</span>
            </div>
            <div class="spec-item spec-wide">
              <span class="spec-label">Kilometer</span>
              <span class="spec-value">{{ mobil.kilometer ? formatHarga(mobil.kilometer) + ' km' : '-' }}</span>
            </div>
          </div>

          <p class="deskripsi">{{ mobil.deskripsi || 'Tidak ada deskripsi tambahan.' }}</p>

          <button class="cta-tanya" @click="bukaDenganPertanyaan(`Ceritakan lebih detail soal ${mobil.nama_mobil}`)">
            Tanya soal mobil ini ke chatbot
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';
import { useChatbot } from '../composables/useChatbot';
import { tiltMove, tiltLeave } from '../composables/useTilt';

const route = useRoute();
const mobil = ref({});
const loading = ref(true);
const error = ref(null);
const apiOrigin = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
const { bukaDenganPertanyaan, state } = useChatbot();

const gambarUtama = computed(() => mobil.value.GambarMobils?.[0]?.url_gambar);

function formatHarga(angka) {
  return new Intl.NumberFormat('id-ID').format(angka);
}

onMounted(async () => {
  try {
    const res = await api.get(`/mobil/${route.params.id}`);
    mobil.value = res.data.data;
  } catch (err) {
    error.value = 'Mobil tidak ditemukan atau server backend tidak berjalan.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 18px 0;
}

.back-link {
  color: var(--text-muted);
  font-size: 14px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--accent);
}

.state-text {
  color: var(--text-muted);
  padding: 60px 0;
}

.state-text.error {
  color: var(--terjual);
}

.detail {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;
  padding: 40px 0 70px;
  align-items: start;
}

@media (max-width: 780px) {
  .detail {
    grid-template-columns: 1fr;
  }
}

.gallery {
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.25s ease-out;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.gallery-main {
  width: 100%;
  border-radius: var(--radius-lg);
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
}

.gallery-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, rgba(255, 255, 255, 0.06), transparent 40%);
  pointer-events: none;
}

.gallery-placeholder {
  aspect-ratio: 4 / 3;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.info {
  border-radius: var(--radius-lg);
  padding: 32px;
  position: sticky;
  top: 90px;
}

.plate {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid;
  margin-bottom: 18px;
}

.plate-tersedia {
  color: var(--tersedia);
  border-color: var(--tersedia);
}

.plate-terjual {
  color: var(--terjual);
  border-color: var(--terjual);
}

.info h1 {
  font-size: 32px;
  margin-bottom: 10px;
  line-height: 1.15;
}

.price {
  font-family: var(--font-mono);
  color: var(--accent-2);
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 26px;
}

.specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 26px;
}

.spec-item {
  background: var(--bg-soft);
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-wide {
  grid-column: 1 / -1;
}

.spec-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-faint);
}

.spec-value {
  font-size: 14px;
  color: var(--text);
  font-weight: 500;
}

.deskripsi {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 26px;
  font-size: 14px;
}

.cta-tanya {
  width: 100%;
  padding: 15px;
  border-radius: var(--radius-sm);
  border: none;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #191207;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-glow);
}

.cta-tanya:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 34px rgba(255, 138, 61, 0.35);
}
</style>
