<template>
  <div class="chatbot">
    <transition name="panel">
      <div v-if="state.terbuka" class="chatbot-panel glass">
        <div class="chatbot-header">
          <span class="chatbot-dot"></span>
          Tanya Arjuna Motor
        </div>

        <div class="chatbot-messages" ref="messagesEl">
          <div v-if="pesanList.length === 0" class="chatbot-empty">
            Halo! Tanya apa saja soal unit mobil kami di sini.
          </div>
          <div v-for="(pesan, i) in pesanList" :key="i" class="bubble"
            :class="pesan.sender === 'customer' ? 'bubble-customer' : 'bubble-bot'">
            {{ pesan.text }}
          </div>
          <div v-if="loading" class="bubble bubble-bot bubble-loading">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>

        <form class="chatbot-input" @submit.prevent="kirimPesan">
          <input v-model="pertanyaan" placeholder="Tanya soal mobil..." :disabled="loading" />
          <button type="submit" :disabled="loading || !pertanyaan.trim()">&uarr;</button>
        </form>
      </div>
    </transition>

    <button class="chatbot-toggle" :class="{ open: state.terbuka }" @click="state.terbuka = !state.terbuka">
      <span class="icon-chat">💬</span>
      <span class="icon-close">✕</span>
    </button>
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
<style scoped>
.chatbot {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}

.chatbot-toggle {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #191207;
  font-size: 22px;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-left: auto;
  display: block;
}
.chatbot-toggle:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 14px 34px rgba(255, 138, 61, 0.4);
}

.icon-chat, .icon-close {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.icon-close { opacity: 0; transform: rotate(-45deg) scale(0.6); }
.chatbot-toggle.open .icon-chat { opacity: 0; transform: rotate(45deg) scale(0.6); }
.chatbot-toggle.open .icon-close { opacity: 1; transform: rotate(0) scale(1); }

.chatbot-panel {
  position: absolute;
  bottom: 68px;
  right: 0;
  width: 330px;
  height: 440px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.panel-enter-active, .panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.panel-enter-from, .panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

.chatbot-header {
  padding: 16px 18px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}
.chatbot-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--tersedia);
  box-shadow: 0 0 8px var(--tersedia);
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chatbot-empty {
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
  margin-top: 30px;
  padding: 0 10px;
}

.bubble {
  max-width: 82%;
  padding: 9px 13px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.45;
}

.bubble-customer {
  align-self: flex-end;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: #191207;
  border-bottom-right-radius: 4px;
}

.bubble-bot {
  align-self: flex-start;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-bottom-left-radius: 4px;
}

.bubble-loading {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 12px 14px;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: bounce 1.2s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
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
  padding: 13px 14px;
  font-size: 13px;
  outline: none;
}
.chatbot-input input::placeholder { color: var(--text-faint); }

.chatbot-input button {
  border: none;
  background: transparent;
  color: var(--accent);
  font-weight: 700;
  font-size: 16px;
  width: 44px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.chatbot-input button:disabled {
  color: var(--text-faint);
  cursor: not-allowed;
}
</style>
