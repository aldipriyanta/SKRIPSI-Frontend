<template>
  <div class="page">
    <header class="admin-topbar">
      <div class="container">
        <RouterLink to="/admin" class="back-link">&larr; Kembali ke dashboard</RouterLink>
      </div>
    </header>

    <main class="container form-wrap">
      <h1>{{ isEdit ? 'Edit Mobil' : 'Tambah Mobil' }}</h1>

      <form @submit.prevent="simpan" class="form">
        <label>Nama Mobil</label>
        <input v-model="form.nama_mobil" required />

        <label>Merek</label>
        <select v-model="form.id_merek" required>
          <option value="" disabled>Pilih merek</option>
          <option v-for="m in daftarMerek" :key="m.id_merek" :value="m.id_merek">{{ m.nama_merek }}</option>
        </select>

        <label>Kategori</label>
        <select v-model="form.id_kategori" required>
          <option value="" disabled>Pilih kategori</option>
          <option v-for="k in daftarKategori" :key="k.id_kategori" :value="k.id_kategori">{{ k.nama_kategori }}</option>
        </select>

        <div class="form-row">
          <div>
            <label>Tipe</label>
            <input v-model="form.tipe" />
          </div>
          <div>
            <label>Tahun</label>
            <input v-model="form.tahun" type="number" />
          </div>
        </div>

        <div class="form-row">
          <div>
            <label>Transmisi</label>
            <input v-model="form.transmisi" />
          </div>
          <div>
            <label>Bahan Bakar</label>
            <input v-model="form.bahan_bakar" />
          </div>
        </div>

        <div class="form-row">
          <div>
            <label>Kilometer</label>
            <input v-model="form.kilometer" type="number" />
          </div>
          <div>
            <label>Harga (Rp)</label>
            <input v-model="form.harga" type="number" required />
          </div>
        </div>

        <label>Status Stok</label>
        <select v-model="form.status_stok">
          <option value="tersedia">Tersedia</option>
          <option value="terjual">Terjual</option>
        </select>

        <label>Deskripsi</label>
        <textarea v-model="form.deskripsi" rows="4"></textarea>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
      </form>

      <div v-if="isEdit" class="gambar-section">
        <h2>Foto Mobil</h2>

        <div class="gambar-grid">
          <div v-for="g in daftarGambar" :key="g.id_gambar" class="gambar-item">
            <img :src="`${apiOrigin}${g.url_gambar}`" />
            <button @click="hapusGambar(g.id_gambar)">Hapus</button>
          </div>
        </div>

        <form @submit.prevent="uploadGambar" class="upload-form">
          <input type="file" accept="image/png, image/jpeg, image/webp" @change="pilihFile" required />
          <button type="submit" :disabled="uploading">{{ uploading ? 'Mengunggah...' : 'Upload' }}</button>
        </form>
      </div>
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
  nama_mobil: '', id_merek: '', id_kategori: '', tipe: '', tahun: '',
  transmisi: '', bahan_bakar: '', kilometer: '', harga: '', status_stok: 'tersedia', deskripsi: '',
});

const daftarMerek = ref([]);
const daftarKategori = ref([]);
const daftarGambar = ref([]);
const error = ref(null);
const saving = ref(false);
const uploading = ref(false);
const fileTerpilih = ref(null);

async function muatReferensi() {
  const [resMerek, resKategori] = await Promise.all([api.get('/merek'), api.get('/kategori')]);
  daftarMerek.value = resMerek.data.data;
  daftarKategori.value = resKategori.data.data;
}

async function muatDataMobil() {
  if (!isEdit.value) return;
  const res = await api.get(`/mobil/${route.params.id}`);
  Object.assign(form, res.data.data);
  daftarGambar.value = res.data.data.GambarMobils || [];
}

async function simpan() {
  error.value = null;
  saving.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/mobil/${route.params.id}`, form);
    } else {
      const res = await api.post('/mobil', form);
      router.push(`/admin/mobil/${res.data.data.id_mobil}`);
      return;
    }
    router.push('/admin');
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal menyimpan data';
  } finally {
    saving.value = false;
  }
}

function pilihFile(e) {
  fileTerpilih.value = e.target.files[0];
}

async function uploadGambar() {
  if (!fileTerpilih.value) return;
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('gambar', fileTerpilih.value);
    await api.post(`/mobil/${route.params.id}/gambar`, formData);
    await muatDataMobil();
  } catch (err) {
    error.value = 'Gagal mengunggah gambar';
  } finally {
    uploading.value = false;
  }
}

async function hapusGambar(idGambar) {
  if (!confirm('Hapus foto ini?')) return;
  await api.delete(`/mobil/gambar/${idGambar}`);
  await muatDataMobil();
}

onMounted(async () => {
  await muatReferensi();
  await muatDataMobil();
});
</script>

<style scoped>
.admin-topbar { border-bottom: 1px solid var(--border); padding: 16px 0; }
.back-link { color: var(--text-muted); font-size: 14px; }

.form-wrap { max-width: 560px; padding-bottom: 60px; }
.form-wrap h1 { font-size: 28px; margin: 32px 0 20px; }

.form { display: flex; flex-direction: column; }
.form label { font-size: 13px; color: var(--text-muted); margin: 14px 0 6px; }
.form input, .form select, .form textarea {
  padding: 10px; border-radius: 6px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text); font-family: inherit;
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.error { color: var(--terjual); font-size: 13px; margin-top: 14px; }

.form button {
  margin-top: 24px; padding: 12px; border-radius: 6px; border: none;
  background: var(--accent); color: var(--bg); font-weight: 600; cursor: pointer;
}
.form button:disabled { opacity: 0.6; cursor: not-allowed; }

.gambar-section { margin-top: 20px; }
.gambar-section h2 { font-size: 20px; margin-bottom: 14px; }
.gambar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-bottom: 20px; }
.gambar-item { position: relative; }
.gambar-item img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; border: 1px solid var(--border); }
.gambar-item button {
  position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7);
  color: var(--terjual); border: none; border-radius: 4px; font-size: 11px; padding: 3px 6px; cursor: pointer;
}

.upload-form { display: flex; gap: 12px; align-items: center; }
.upload-form input { color: var(--text-muted); }
.upload-form button {
  padding: 8px 16px; border-radius: 6px; border: none;
  background: var(--surface); border: 1px solid var(--border); color: var(--text); cursor: pointer;
}
</style>