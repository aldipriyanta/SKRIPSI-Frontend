<template>
  <div class="page">
    <header class="topbar glass">
      <div class="container topbar-inner">
        <div class="brand-mark">
          <img class="logo-mark" src="/showroom/logo.png" alt="Logo Arjuna Motor" />
          <div class="brand-text">
            <span class="brand">ARJUNA MOTOR</span>
            <span class="tagline">Showroom Mobil Bekas Terpercaya</span>
          </div>
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text reveal in-view">
          <span class="eyebrow">Unit siap jalan &middot; harga transparan</span>
          <h1>Temukan mobil bekas<br /><span class="gradient-text">yang siap jalan</span> hari ini.</h1>
          <p>Semua unit sudah diperiksa menyeluruh, harga sudah final di depan, dan kalau masih ragu tinggal tanya
            chatbot kami kapan saja.</p>
        </div>

        <div class="hero-stat glass" @mousemove="(e) => tiltMove(e, 10)" @mouseleave="tiltLeave">
          <span class="hero-stat-number">{{ jumlahTersedia }}</span>
          <span class="hero-stat-label">Unit tersedia sekarang</span>
          <div class="hero-stat-glow"></div>
        </div>
      </div>
    </section>

    <main class="container" ref="mainEl">
      <div class="filter-row reveal">
        <button class="chip" :class="{ active: filterKategori === null }" @click="filterKategori = null">
          Semua
        </button>
        <button v-for="kategori in daftarKategoriUnik" :key="kategori" class="chip"
          :class="{ active: filterKategori === kategori }" @click="filterKategori = kategori">
          {{ kategori }}
        </button>
      </div>

      <div v-if="loading" class="state-text">Memuat data mobil...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>
      <div v-else-if="mobilTersaring.length === 0" class="state-text">
        Belum ada mobil di kategori ini.
      </div>

      <div v-else class="grid">
        <RouterLink v-for="(mobil, i) in mobilTersaring" :key="mobil.id_mobil" :to="`/mobil/${mobil.id_mobil}`"
          class="card reveal" :style="{ transitionDelay: `${(i % 8) * 60}ms` }" @mousemove="(e) => tiltMove(e, 6)"
          @mouseleave="tiltLeave">
          <div class="card-image">
            <img v-if="mobil.GambarMobils && mobil.GambarMobils[0]"
              :src="`${apiOrigin}${mobil.GambarMobils[0].url_gambar}`" :alt="mobil.nama_mobil" loading="lazy" />
            <div v-else class="card-image-placeholder">Belum ada foto</div>
            <div class="card-image-sheen"></div>

            <span class="plate" :class="mobil.status_stok === 'tersedia' ? 'plate-tersedia' : 'plate-terjual'">
              {{ mobil.status_stok === 'tersedia' ? 'TERSEDIA' : 'TERJUAL' }}
            </span>

            <label class="compare-checkbox" @click.stop.prevent="toggleMobil(mobil.id_mobil)">
              <input type="checkbox" :checked="isDipilih(mobil.id_mobil)" readonly />
              Bandingkan
            </label>
          </div>

          <div class="card-body">
            <h3>{{ mobil.nama_mobil }}</h3>
            <p class="card-meta">{{ mobil.Merek?.nama_merek }} · {{ mobil.Kategori?.nama_kategori }} · {{ mobil.tahun }}
            </p>
            <p class="card-price">Rp {{ formatHarga(mobil.harga) }}</p>
            <span class="card-cta">Lihat Detail <span class="arrow">&rarr;</span></span>
          </div>
        </RouterLink>
      </div>
    </main>
    <div v-if="compareState.idTerpilih.length > 0" class="compare-bar">
      <span>{{ compareState.idTerpilih.length }} / {{ MAKS_BANDINGKAN }} mobil dipilih</span>
      <button class="compare-btn" :disabled="compareState.idTerpilih.length < 2" @click="bukaPerbandingan">
        Bandingkan Sekarang
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import api from '../api/axios';
import { useChatbot } from '../composables/useChatbot';
import { tiltMove, tiltLeave, observeReveal } from '../composables/useTilt';
import { useRouter } from 'vue-router';
import { useCompare } from '../composables/useCompare';

const daftarMobil = ref([]);
const loading = ref(true);
const error = ref(null);
const filterKategori = ref(null);
const apiOrigin = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
const { bukaDenganPertanyaan } = useChatbot();
const mainEl = ref(null);
const router = useRouter();
const { state: compareState, toggleMobil, isDipilih, MAKS_BANDINGKAN } = useCompare();

const jumlahTersedia = computed(
  () => daftarMobil.value.filter((m) => m.status_stok === 'tersedia').length
);


function formatHarga(harga) {
  return new Intl.NumberFormat('id-ID').format(harga);
}

function bukaPerbandingan() {
  router.push(`/bandingkan?ids=${compareState.idTerpilih.join(',')}`);
}

function normalisasi(teks) {
  return (teks || '').trim().toLowerCase();
}

const daftarKategoriUnik = computed(() => {
  const set = new Set(daftarMobil.value.map((m) => m.Kategori?.nama_kategori).filter(Boolean));
  return [...set];
});

const mobilTersaring = computed(() => {
  if (!filterKategori.value) return daftarMobil.value;
  return daftarMobil.value.filter(
    (m) => normalisasi(m.Kategori?.nama_kategori) === normalisasi(filterKategori.value)
  );
});

onMounted(async () => {
  try {
    const res = await api.get('/mobil');
    daftarMobil.value = Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    error.value = 'Gagal memuat data mobil.';
  } finally {
    loading.value = false;
    await nextTick();
    if (mainEl.value) observeReveal(mainEl.value);
  }
});
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 16px 0;
}

.topbar-inner {
  display: flex;
  align-items: center;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-mark {
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 6px;
}

.face {
  position: absolute;
  inset: 0;
}

.face-top {
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  transform: translateZ(6px);
  border-radius: 3px;
}

.face-left {
  background: var(--accent);
  opacity: 0.55;
  transform: rotateY(-90deg) translateZ(6px);
  border-radius: 3px;
}

.face-right {
  background: var(--violet);
  opacity: 0.5;
  transform: rotateX(90deg) translateZ(6px);
  border-radius: 3px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tagline {
  font-size: 12px;
  color: var(--text-muted);
}

.hero {
  padding: 88px 0 64px;
  position: relative;
}

.hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}

.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 18px;
}

.hero-text h1 {
  font-size: 52px;
  line-height: 1.08;
  max-width: 560px;
}

.hero-text p {
  color: var(--text-muted);
  margin-top: 18px;
  max-width: 440px;
  font-size: 15px;
  line-height: 1.6;
}

.hero-stat {
  position: relative;
  text-align: center;
  padding: 36px 46px;
  border-radius: var(--radius-lg);
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.25s ease-out;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.hero-stat-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255, 138, 61, 0.25), transparent 60%);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.hero-stat:hover .hero-stat-glow {
  opacity: 1;
}

.hero-stat-number {
  display: block;
  font-family: var(--font-mono);
  font-size: 52px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}

.hero-stat-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 8px;
  display: block;
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 8px 0 28px;
}

.chip {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--accent);
  color: var(--text);
  transform: translateY(-1px);
}

.chip.active {
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  border-color: transparent;
  color: #191207;
  font-weight: 600;
  box-shadow: var(--shadow-glow);
}

.state-text {
  color: var(--text-muted);
  padding: 40px 0;
}

.state-text.error {
  color: var(--terjual);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 22px;
  padding-bottom: 70px;
}

.card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  backdrop-filter: blur(16px);
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0);
  transition: transform 0.25s ease-out, border-color 0.2s ease, box-shadow 0.25s ease;
}

.card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-lg);
}

.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #101014;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover .card-image img {
  transform: scale(1.06);
}

.card-image-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(0, 0, 0, 0.55) 100%);
  pointer-events: none;
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
  bottom: 12px;
  left: 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid;
  backdrop-filter: blur(6px);
  background: rgba(8, 8, 12, 0.55);
}

.plate-tersedia {
  color: var(--tersedia);
  border-color: var(--tersedia);
}

.plate-terjual {
  color: var(--terjual);
  border-color: var(--terjual);
}

.card-body {
  padding: 16px 18px 18px;
}

.card-body h3 {
  font-size: 19px;
}

.card-meta {
  color: var(--text-muted);
  font-size: 13px;
  margin: 5px 0 12px;
}

.card-price {
  color: var(--accent-2);
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 10px;
  font-family: var(--font-mono);
}

.card-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  padding-top: 12px;
  width: 100%;
  transition: color 0.2s ease;
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.card:hover .card-cta {
  color: var(--accent);
}

.card:hover .arrow {
  transform: translateX(4px);
}

.compare-checkbox {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(8, 8, 12, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid var(--border);
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  color: var(--text);
  cursor: pointer;
}

.compare-checkbox input {
  margin: 0;
  cursor: pointer;
  pointer-events: none;
}

.compare-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 10px 10px 10px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-lg);
  z-index: 90;
  backdrop-filter: blur(16px);
}

.compare-bar span {
  font-size: 13px;
  color: var(--text-muted);
}

.compare-btn {
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #191207;
  border: none;
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.compare-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .hero-text h1 {
    font-size: 36px;
  }

  .hero-stat {
    padding: 26px 34px;
  }

  .hero-stat-number {
    font-size: 40px;
  }
}
</style>
