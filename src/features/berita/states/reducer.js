import { BeritaActionType } from "./action";

const initialState = {
  berita: [],
  agenda: [],
  pengumuman: [],
  loading: false,
};

export default function beritaReducer(state = initialState, action) {
  switch (action.type) {
    case BeritaActionType.SET_BERITA:
      return { ...state, berita: action.payload };

    case BeritaActionType.SET_AGENDA:
      return { ...state, agenda: action.payload };

    case BeritaActionType.SET_PENGUMUMAN:
      return { ...state, pengumuman: action.payload };

    case BeritaActionType.SET_BERITA_LOADING:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}