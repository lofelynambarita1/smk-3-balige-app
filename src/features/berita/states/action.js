// src/features/berita/states/action.js
import beritaApi from "../api/beritaApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const BeritaActionType = {
  SET_BERITA:         "SET_BERITA",
  SET_AGENDA:         "SET_AGENDA",
  SET_PENGUMUMAN:     "SET_PENGUMUMAN",
  SET_BERITA_LOADING: "SET_BERITA_LOADING",
};

// ── Sync creators ────────────────────────────────────────────
export const setBerita        = (d) => ({ type: BeritaActionType.SET_BERITA,         payload: d });
export const setAgenda        = (d) => ({ type: BeritaActionType.SET_AGENDA,         payload: d });
export const setPengumuman    = (d) => ({ type: BeritaActionType.SET_PENGUMUMAN,     payload: d });
export const setBeritaLoading = (s) => ({ type: BeritaActionType.SET_BERITA_LOADING, payload: s });

// ── GET ──────────────────────────────────────────────────────
export function asyncGetBerita() {
  return async (dispatch) => {
    try { dispatch(setBerita(await beritaApi.getBerita())); }
    catch { dispatch(setBerita([])); }
  };
}
export function asyncGetAgenda() {
  return async (dispatch) => {
    try { dispatch(setAgenda(await beritaApi.getAgenda())); }
    catch { dispatch(setAgenda([])); }
  };
}
export function asyncGetPengumuman() {
  return async (dispatch) => {
    try { dispatch(setPengumuman(await beritaApi.getPengumuman())); }
    catch { dispatch(setPengumuman([])); }
  };
}

// ── LOAD SEMUA ───────────────────────────────────────────────
export function asyncLoadAllBeritaData() {
  return async (dispatch) => {
    dispatch(setBeritaLoading(true));
    await Promise.all([
      dispatch(asyncGetBerita()),
      dispatch(asyncGetAgenda()),
      dispatch(asyncGetPengumuman()),
    ]);
    dispatch(setBeritaLoading(false));
  };
}

// ── BERITA CRUD ──────────────────────────────────────────────
export function asyncPostBerita(judul, isi, kategori, tanggal, gambar, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.postBerita(judul, isi, kategori, tanggal, gambar);
      showSuccessDialog("Berita berhasil ditambahkan");
      dispatch(asyncGetBerita());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}
export function asyncPutBerita(id, judul, isi, kategori, tanggal, gambar, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.putBerita(id, judul, isi, kategori, tanggal, gambar);
      showSuccessDialog("Berita berhasil diperbarui");
      dispatch(asyncGetBerita());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}
export function asyncDeleteBerita(id, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.deleteBerita(id);
      showSuccessDialog("Berita berhasil dihapus");
      dispatch(asyncGetBerita());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}

// ── AGENDA CRUD ──────────────────────────────────────────────
export function asyncPostAgenda(judul, tanggal, lokasi, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.postAgenda(judul, tanggal, lokasi);
      showSuccessDialog("Agenda berhasil ditambahkan");
      dispatch(asyncGetAgenda());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}
export function asyncPutAgenda(id, judul, tanggal, lokasi, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.putAgenda(id, judul, tanggal, lokasi);
      showSuccessDialog("Agenda berhasil diperbarui");
      dispatch(asyncGetAgenda());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}
export function asyncDeleteAgenda(id, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.deleteAgenda(id);
      showSuccessDialog("Agenda berhasil dihapus");
      dispatch(asyncGetAgenda());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}

// ── PENGUMUMAN CRUD ──────────────────────────────────────────
export function asyncPostPengumuman(judul, isi, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.postPengumuman(judul, isi);
      showSuccessDialog("Pengumuman berhasil ditambahkan");
      dispatch(asyncGetPengumuman());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}
export function asyncPutPengumuman(id, judul, isi, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.putPengumuman(id, judul, isi);
      showSuccessDialog("Pengumuman berhasil diperbarui");
      dispatch(asyncGetPengumuman());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}
export function asyncDeletePengumuman(id, cb) {
  return async (dispatch) => {
    try {
      await beritaApi.deletePengumuman(id);
      showSuccessDialog("Pengumuman berhasil dihapus");
      dispatch(asyncGetPengumuman());
      if (cb) cb();
    } catch (e) { showErrorDialog(e.message); }
  };
}