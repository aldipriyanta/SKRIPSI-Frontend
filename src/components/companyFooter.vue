<template>
  <footer class="footer">
    <div class="container footer-top">
      <div class="footer-profile">
        <h2>ARJUNA MOTOR</h2>
        <p class="footer-desc">
          Showroom mobil bekas terpercaya dengan unit yang sudah diperiksa dan harga transparan.
          Kunjungi showroom kami atau hubungi tim kami untuk konsultasi.
        </p>

        <div class="footer-info">
          <div class="info-row">
            <span class="info-label">Alamat</span>
            <span>Jl. Contoh Raya No. 123, Malang, Jawa Timur</span>
          </div>
          <div class="info-row">
            <span class="info-label">Jam Buka</span>
            <span>Senin - Sabtu, 08.00 - 17.00 WIB</span>
          </div>
          <div class="info-row">
            <span class="info-label">Telepon</span>
            <span>0812-3456-7890</span>
          </div>
        </div>

        <div class="social-links">
          <a href="https://instagram.com/arjunamotor" target="_blank" rel="noopener" class="social-link">Instagram</a>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener" class="social-link">WhatsApp</a>
          <a href="https://facebook.com/arjunamotor" target="_blank" rel="noopener" class="social-link">Facebook</a>
          <a href="https://www.olx.co.id/toko/arjuna-motor" target="_blank" rel="noopener" class="social-link">OLX</a>
        </div>
      </div>

      <div class="footer-map">
        <span class="section-label">Lokasi Showroom</span>
        <iframe
          class="map-frame"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63342.98!2d112.6!3d-7.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNTgnNDguMCJTIDExMsKwMzYnMDAuMCJF!5e0!3m2!1sid!2sid!4v0000000000"
          width="100%"
          height="220"
          style="border:0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

    <div class="container">
      <span class="section-label">Foto Showroom</span>
      <div class="showroom-gallery">
        <div class="showroom-photo placeholder">Foto showroom 1</div>
        <div class="showroom-photo placeholder">Foto showroom 2</div>
        <div class="showroom-photo placeholder">Foto showroom 3</div>
        <div class="showroom-photo placeholder">Foto showroom 4</div>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>&copy; {{ tahunSekarang }} Arjuna Motor. Semua hak dilindungi.</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const tahunSekarang = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  margin-top: 60px;
  padding: 48px 0 0;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
  padding-bottom: 32px;
}
@media (max-width: 720px) {
  .footer-top { grid-template-columns: 1fr; }
}

.footer-profile h2 {
  font-size: 22px;
  color: var(--accent);
  letter-spacing: 1px;
}
.footer-desc {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  max-width: 420px;
  margin: 10px 0 20px;
}

.footer-info { margin-bottom: 20px; }
.info-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 6px;
}
.info-label {
  color: var(--text-muted);
  min-width: 80px;
  flex-shrink: 0;
}

.social-links { display: flex; gap: 10px; flex-wrap: wrap; }
.social-link {
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--text);
  transition: all 0.15s ease;
}
.social-link:hover { border-color: var(--accent); color: var(--accent); }

.section-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.map-frame {
  border-radius: 8px;
  border: 1px solid var(--border);
}

.showroom-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  padding-bottom: 32px;
}
.showroom-photo {
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.showroom-photo.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 16px 0;
  text-align: center;
}
.footer-bottom p {
  color: var(--text-muted);
  font-size: 12px;
  margin: 0;
}
</style>