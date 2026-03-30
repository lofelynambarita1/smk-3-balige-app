import { ActionType } from "./action";

// ================= SEJARAH =================
export function sejarahIdentitasReducer(state = [], action) {
  switch (action.type) {
    case ActionType.SET_SEJARAH:
      return action.payload;
    default:
      return state;
  }
}

// ================= VISI MISI =================
export function visiMisiReducer(state = [], action) {
  switch (action.type) {
    case ActionType.SET_VISI_MISI:
      return action.payload;
    default:
      return state;
  }
}

// ================= PROGRAM =================
export function programKeahlianReducer(state = [], action) {
  switch (action.type) {
    case ActionType.SET_PROGRAM_KEAHLIAN:
      return action.payload;
    default:
      return state;
  }
}

// ================= MITRA =================
export function mitraKerjasamaReducer(state = [], action) {
  switch (action.type) {
    case ActionType.SET_MITRA:
      return action.payload;
    default:
      return state;
  }
}

// ================= PRESTASI =================
export function prestasiReducer(state = [], action) {
  switch (action.type) {
    case ActionType.SET_PRESTASI:
      return action.payload;
    default:
      return state;
  }
}

// ================= OPTIONAL =================
export function strukturOrganisasiReducer(state = [], action) {
  return state;
}

export function fasilitasReducer(state = [], action) {
  return state;
}

export function profilLoadingReducer(state = false, action) {
  return state;
}