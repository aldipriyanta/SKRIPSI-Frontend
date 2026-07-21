import { reactive } from 'vue';

const state = reactive({
  terbuka: false,
  prefill: '',
});

export function useChatbot() {
  function bukaDenganPertanyaan(teks) {
    state.prefill = teks;
    state.terbuka = true;
  }
//asd
  return { state, bukaDenganPertanyaan };
}