// src/features/berita/states/reducer.js
import { BeritaActionType } from "./action";

export function beritaReducer(state = [], action) {
  switch (action.type) {
    case BeritaActionType.SET_BERITA:
      return action.payload;
    default:
      return state;
  }
}

export function agendaReducer(state = [], action) {
  switch (action.type) {
    case BeritaActionType.SET_AGENDA:
      return action.payload;
    default:
      return state;
  }
}

export function pengumumanReducer(state = [], action) {
  switch (action.type) {
    case BeritaActionType.SET_PENGUMUMAN:
      return action.payload;
    default:
      return state;
  }
}

export function beritaLoadingReducer(state = false, action) {
  switch (action.type) {
    case BeritaActionType.SET_BERITA_LOADING:
      return action.payload;
    default:
      return state;
  }
}