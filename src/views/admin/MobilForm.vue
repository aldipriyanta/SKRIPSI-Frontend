<template>
  <div class="page">
    <header class="admin-topbar">
      <div class="container">
        <RouterLink to="/admin" class="back-link">&larr; Kembali ke dashboard</RouterLink>
      </div>
    </header>

    <main class="container form-wrap">
      <h1>{{ isEdit ? 'Edit Mobil' : 'Tambah Mobil' }}</h1>
      <p class="form-subtitle">{{ isEdit ? 'Perbarui detail unit yang sudah terdaftar.'
        : 'Lengkapi detail unit baru untuk ditampilkan di katalog.' }}</p>

      <form @submit.prevent="simpan" class="form-card">
        <section class="form-section">
          <h2 class="section-title">Informasi Dasar</h2>

          <div class="field">
            <label>Nama Mobil</label>
            <input v-model="form.nama_mobil" placeholder="Contoh: Avanza, Brio, Xenia" required />
          </div>

          <div class="field-row">
            <div class="field">
              <label>Merek</label>
              <input v-model="form.nama_merek" list="daftar-merek" placeholder="Contoh: Toyota, Honda" required />
              <datalist id="daftar-merek">
                <option v-for="m in daftarMerekAda" :key="m.id_merek" :value="m.nama_merek" />
              </datalist>
            </div>
            <div class="field">
              <label>Kategori</label>
              <input v-model="form.nama_kategori" list="daftar-kategori" placeholder="Contoh: MPV, SUV, Sedan"
                required />
              <datalist id="daftar-kategori">
                <option v-for="k in daftarKategoriAda" :key="k.id_kategori" :value="k.nama_kategori" />
              </datalist>
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2 class="section-title">Spesifikasi</h2>

          <div class="field-row">
            <div class="field">
              <label>Tipe / Varian</label>
              <input v-model="form.tipe" placeholder="Contoh: G, RS, Ultimate" />
            </div>
            <div class="field">
              <label>Tahun Produksi</label>
              <input v-model="form.tahun" type="number" placeholder="2023" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Transmisi</label>
              <select v-model="form.transmisi">
                <option value="">Pilih transmisi</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
            <div class="field">
              <label>Bahan Bakar</label>
              <select v-model="form.bahan_bakar">
                <option value="">Pilih bahan bakar</option>
                <option value="Bensin">Bensin</option>
                <option value="Diesel">Diesel</option>
                <option value="Listrik">Listrik</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label>Kilometer</label>
            <input v-model="form.kilometer" type="number" placeholder="15000" />
          </div>
        </section>

        <section class="form-section">
          <h2 class="section-title">Harga & Status</h2>

          <div class="field-row">
            <div class="field">
              <label>Harga (Rp)</label>
              <input v-model="form.harga" type="number" placeholder="185000000" required />
            </div>
            <div class="field">
              <label>Status Stok</label>
              <select v-model="form.status_stok">
                <option value="tersedia">Tersedia</option>
                <option value="terjual">Terjual</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label>Deskripsi</label>
            <textarea v-model="form.deskripsi" rows="4"
              placeholder="Kondisi kendaraan, riwayat servis, atau info tambahan lainnya"></textarea>
          </div>
        </section>

        <section v-if="isEdit" class="form-section">
          <h2 class="section-title">Foto Mobil</h2>

          <div v-if="daftarGambar.length" class="gambar-grid">
            <div v-for="g in daftarGambar" :key="g.id_gambar" class="gambar-item">
              <img :src="`${apiOrigin}${g.url_gambar}`" />
              <button type="button" class="gambar-hapus" @click="hapusGambar(g.id_gambar)"
                aria-label="Hapus foto">&times;</button>
            </div>
          </div>
          <p v-else class="empty-note">Belum ada foto untuk mobil ini.</p>

          <div class="field">
            <label>Tambah foto baru (opsional)</label>
            <input type="file" accept="image/png, image/jpeg, image/webp" @change="pilihFile" />
            <p class="field-hint">Foto akan diunggah otomatis saat kamu klik "Simpan Data" di bawah.</p>
          </div>
        </section>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="form-actions">
          <RouterLink to="/admin" class="btn-secondary">Batal</RouterLink>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? (fileTerpilih ? 'Menyimpan & mengunggah...' : 'Menyimpan...') : 'Simpan Data' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../api/axios';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const apiOrigin = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

const form = reactive({
  nama_mobil: '', nama_merek: '', nama_kategori: '', tipe: '', tahun: '',
  transmisi: '', bahan_bakar: '', kilometer: '', harga: '', status_stok: 'tersedia', deskripsi: '',
});

const daftarGambar = ref([]);
const error = ref(null);
const saving = ref(false);
const fileTerpilih = ref(null);
const daftarMerekAda = ref([]);
const daftarKategoriAda = ref([]);

async function muatDataMobil() {
  if (!isEdit.value) return;
  const res = await api.get(`/mobil/${route.params.id}`);
  const data = res.data.data;
  Object.assign(form, data);
  form.nama_merek = data.Merek?.nama_merek || '';
  form.nama_kategori = data.Kategori?.nama_kategori || '';
  daftarGambar.value = data.GambarMobils || [];
}

async function simpan() {
  error.value = null;
  saving.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/mobil/${route.params.id}`, form);
      await uploadFotoJikaAda();
      router.push('/admin');
    } else {
      const res = await api.post('/mobil', form);
      router.push(`/admin/mobil/${res.data.data.id_mobil}`);
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal menyimpan data';
  } finally {
    saving.value = false;
  }
}

function pilihFile(e) {
  fileTerpilih.value = e.target.files[0] || null;
}

async function uploadFotoJikaAda() {
  if (!fileTerpilih.value) return;
  const formData = new FormData();
  formData.append('gambar', fileTerpilih.value);
  await api.post(`/mobil/${route.params.id}/gambar`, formData);
  fileTerpilih.value = null;
}

async function hapusGambar(idGambar) {
  if (!confirm('Hapus foto ini?')) return;
  await api.delete(`/mobil/gambar/${idGambar}`);
  await muatDataMobil();
}

onMounted(async () => {
  await muatDataMobil();
  try {
    const [resMerek, resKategori] = await Promise.all([
      api.get('/merek'),
      api.get('/kategori'),
    ]);
    daftarMerekAda.value = Array.isArray(resMerek.data.data) ? resMerek.data.data : [];
    daftarKategoriAda.value = Array.isArray(resKategori.data.data) ? resKategori.data.data : [];
  } catch (err) {
    // Gagal ambil saran datalist tidak fatal — form tetap bisa dipakai dengan ketik manual.
  }
});
</script>

<style scoped>
.admin-topbar {
  border-bottom: 1px solid var(--border);
  padding: 16px 0;
}

.back-link {
  color: var(--text-muted);
  font-size: 14px;
}

.back-link:hover {
  color: var(--accent);
}

.form-wrap {
  max-width: 640px;
  padding: 32px 24px 60px;
}

.form-wrap h1 {
  font-size: 28px;
}

.form-subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin: 6px 0 24px;
}

.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 24px;
}

.form-section+.form-section {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.section-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.field input,
.field select,
.field textarea {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-family: inherit;
  font-size: 14px;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.field textarea {
  resize: vertical;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.field-row .field {
  margin-bottom: 0;
}

.error {
  color: var(--terjual);
  font-size: 13px;
  margin: 0 0 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  text-align: center;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  color: var(--text);
  border-color: var(--text-muted);
}

.empty-note {
  color: var(--text-muted);
  font-size: 13px;
  margin: 0 0 16px;
}

.gambar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.gambar-item {
  position: relative;
}

.gambar-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
  display: block;
}

.gambar-hapus {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: var(--terjual);
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.field-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 8px 0 0;
}
</style>