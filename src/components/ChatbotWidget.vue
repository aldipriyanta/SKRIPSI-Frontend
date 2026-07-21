<template>
  <div class="chatbot">
    <button class="chatbot-toggle" @click="state.terbuka = !state.terbuka">
      {{ state.terbuka ? '✕' : '💬' }}
    </button>

    <div v-if="state.terbuka" class="chatbot-panel">
      <div class="chatbot-header">Tanya Arjuna Motor</div>

      <div class="chatbot-messages" ref="messagesEl">
        <div v-for="(pesan, i) in pesanList" :key="i" class="bubble"
          :class="pesan.sender === 'customer' ? 'bubble-customer' : 'bubble-bot'">
          {{ pesan.text }}
        </div>
        <div v-if="loading" class="bubble bubble-bot bubble-loading">Mengetik...</div>
      </div>

      <form class="chatbot-input" @submit.prevent="kirimPesan">
        <input v-model="pertanyaan" placeholder="Tanya soal mobil..." :disabled="loading" />
        <button type="submit" :disabled="loading || !pertanyaan.trim()">Kirim</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import api from '../api/axios';
import { useChatbot } from '../composables/useChatbot';

const { state } = useChatbot();
const pertanyaan = ref('');
const pesanList = ref([]);
const loading = ref(false);
const messagesEl = ref(null);

const sessionId = crypto.randomUUID
  ? crypto.randomUUID()
  : `sesi-${Date.now()}-${Math.random()}`;

watch(() => state.prefill, (teks) => {
  if (teks) {
    pertanyaan.value = teks;
    kirimPesan();
    state.prefill = '';
  }
});

async function kirimPesan() {
  const teks = pertanyaan.value.trim();
  if (!teks) return;

  pesanList.value.push({ sender: 'customer', text: teks });
  pertanyaan.value = '';
  loading.value = true;
  scrollBawah();

  try {
    const res = await api.post('/chatbot', { session_id: sessionId, pertanyaan: teks });
    pesanList.value.push({ sender: 'bot', text: res.data.jawaban });
  } catch (err) {
    pesanList.value.push({ sender: 'bot', text: 'Maaf, chatbot sedang tidak bisa merespons. Coba lagi nanti.' });
  } finally {
    loading.value = false;
    scrollBawah();
  }
}

async function scrollBawah() {
  await nextTick();
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
}
</script>
<!-- asd -->
<style scoped>
.chatbot {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.chatbot-toggle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: var(--bg);
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.chatbot-panel {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 320px;
  height: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.chatbot-header {
  padding: 14px 16px;
  font-family: var(--font-display);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
}

.bubble-customer {
  align-self: flex-end;
  background: var(--accent);
  color: var(--bg);
}

.bubble-bot {
  align-self: flex-start;
  background: var(--bg);
  border: 1px solid var(--border);
}

.bubble-loading {
  color: var(--text-muted);
  font-style: italic;
}

.chatbot-input {
  display: flex;
  border-top: 1px solid var(--border);
}

.chatbot-input input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text);
  padding: 12px;
  font-size: 13px;
  outline: none;
}

.chatbot-input button {
  border: none;
  background: transparent;
  color: var(--accent);
  font-weight: 600;
  padding: 0 16px;
  cursor: pointer;
}

.chatbot-input button:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}
</style>