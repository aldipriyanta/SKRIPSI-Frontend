import { reactive } from 'vue';

const MAKS_BANDINGKAN = 3;

const state = reactive({
  idTerpilih: [],
});

function toggleMobil(id) {
  const index = state.idTerpilih.indexOf(id);
  if (index > -1) {
    state.idTerpilih.splice(index, 1);
  } else if (state.idTerpilih.length < MAKS_BANDINGKAN) {
    state.idTerpilih.push(id);
  }
}

function isDipilih(id) {
  return state.idTerpilih.includes(id);
}

function resetPilihan() {
  state.idTerpilih = [];
}

export function useCompare() {
  return { state, toggleMobil, isDipilih, resetPilihan, MAKS_BANDINGKAN };
}