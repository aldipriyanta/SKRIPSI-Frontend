<template>
  <div class="page">
    <header class="topbar">
      <div class="container">
        <RouterLink to="/" class="back-link">&larr; Kembali ke daftar mobil</RouterLink>
      </div>
    </header>

    <main class="container">
      <h1 class="page-title">Bandingkan Mobil</h1>

      <div v-if="loading" class="state-text">Memuat data perbandingan...</div>
      <div v-else-if="error" class="state-text error">{{ error }}</div>
      <div v-else-if="daftarMobil.length < 2" class="state-text">
        Pilih minimal 2 mobil dari katalog untuk membandingkan.
        <RouterLink to="/" class="link-inline">Kembali ke katalog</RouterLink>
      </div>

      <div v-else class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="label-col"></th>
              <th v-for="mobil in daftarMobil" :key="mobil.id_mobil">
                <img
                  v-if="mobil.GambarMobils && mobil.GambarMobils[0]"
                  :src="`${apiOrigin}${mobil.GambarMobils[0].url_gambar}`"
                  class="compare-img"
                />
                <div v-else class="compare-img-placeholder">Belum ada foto</div>
                <RouterLink :to="`/mobil/${mobil.id_mobil}`" class="compare-name">{{ mobil.nama_mobil }}</RouterLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="label-col">Status</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">
                <span class="plate" :class="mobil.status_stok === 'tersedia' ? 'plate-tersedia' : 'plate-terjual'">
                  {{ mobil.status_stok === 'tersedia' ? 'TERSEDIA' : 'TERJUAL' }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="label-col">Harga</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil" class="highlight">
                Rp {{ formatHarga(mobil.harga) }}
              </td>
            </tr>
            <tr>
              <td class="label-col">Merek</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">{{ mobil.Merek?.nama_merek || '-' }}</td>
            </tr>
            <tr>
              <td class="label-col">Kategori</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">{{ mobil.Kategori?.nama_kategori || '-' }}</td>
            </tr>
            <tr>
              <td class="label-col">Tipe</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">{{ mobil.tipe || '-' }}</td>
            </tr>
            <tr>
              <td class="label-col">Tahun</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">{{ mobil.tahun || '-' }}</td>
            </tr>
            <tr>
              <td class="label-col">Transmisi</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">{{ mobil.transmisi || '-' }}</td>
            </tr>
            <tr>
              <td class="label-col">Bahan Bakar</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">{{ mobil.bahan_bakar || '-' }}</td>
            </tr>
            <tr>
              <td class="label-col">Kilometer</td>
              <td v-for="mobil in daftarMobil" :key="mobil.id_mobil">
                {{ mobil.kilometer ? formatHarga(mobil.kilometer) + ' km' : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';

const route = useRoute();
const daftarMobil = ref([]);
const loading = ref(true);
const error = ref(null);
const apiOrigin = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

function formatHarga(angka) {
  return new Intl.NumberFormat('id-ID').format(angka);
}

onMounted(async () => {
  const ids = (route.query.ids || '').split(',').filter(Boolean);

  if (ids.length < 2) {
    loading.value = false;
    return;
  }

  try {
    const hasil = await Promise.all(ids.map((id) => api.get(`/mobil/${id}`)));
    daftarMobil.value = hasil.map((res) => res.data.data);
  } catch (err) {
    error.value = 'Gagal memuat data perbandingan.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.topbar { border-bottom: 1px solid var(--border); padding: 20px 0; }
.back-link { color: var(--text-muted); font-size: 14px; }
.back-link:hover { color: var(--accent); }

.page-title { font-size: 32px; margin: 32px 0 24px; }

.state-text { color: var(--text-muted); padding: 40px 0; }
.state-text.error { color: var(--terjual); }
.link-inline { color: var(--accent); }

.compare-table-wrap { overflow-x: auto; padding-bottom: 60px; }
.compare-table { border-collapse: collapse; min-width: 600px; width: 100%; }
.compare-table th, .compare-table td {
  border: 1px solid var(--border);
  padding: 12px 16px;
  text-align: center;
  font-size: 14px;
}
.label-col {
  text-align: left;
  color: var(--text-muted);
  font-size: 13px;
  background: var(--surface);
  white-space: nowrap;
}
.highlight { color: var(--accent); font-weight: 600; }

.compare-img { width: 140px; aspect-ratio: 4/3; object-fit: cover; border-radius: 6px; margin-bottom: 8px; }
.compare-img-placeholder {
  width: 140px; aspect-ratio: 4/3; border-radius: 6px; margin: 0 auto 8px;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg); color: var(--text-muted); font-size: 11px;
}
.compare-name { display: block; font-weight: 600; font-size: 15px; }

.plate {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1.5px solid;
}
.plate-tersedia { color: var(--tersedia); border-color: var(--tersedia); }
.plate-terjual { color: var(--terjual); border-color: var(--terjual); }
</style>