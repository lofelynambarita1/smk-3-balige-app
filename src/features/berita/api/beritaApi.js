// src/features/berita/api/beritaApi.js
import apiHelper, { BASE_URL } from "../../../helpers/apiHelper";

// ── BERITA ───────────────────────────────────────────────────
async function getBerita() {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita`, { method: "GET" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function postBerita(judul, isi, kategori, tanggal, gambarFile) {
  const fd = new FormData();
  fd.append("judul", judul);
  fd.append("isi", isi);
  fd.append("kategori", kategori);
  if (tanggal) fd.append("tanggal", tanggal);
  if (gambarFile) fd.append("gambar", gambarFile);
  const res = await apiHelper.fetchData(`${BASE_URL}/berita`, { method: "POST", body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function putBerita(id, judul, isi, kategori, tanggal, gambarFile) {
  const fd = new FormData();
  if (judul) fd.append("judul", judul);
  if (isi) fd.append("isi", isi);
  if (kategori) fd.append("kategori", kategori);
  if (tanggal) fd.append("tanggal", tanggal);
  if (gambarFile) fd.append("gambar", gambarFile);
  const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, { method: "PUT", body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function deleteBerita(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}

// ── PENGUMUMAN ───────────────────────────────────────────────
async function getPengumuman() {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman`, { method: "GET" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function postPengumuman(judul, isi) {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ judul, isi }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function putPengumuman(id, judul, isi) {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ judul, isi }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function deletePengumuman(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}

// ── AGENDA ───────────────────────────────────────────────────
async function getAgenda() {
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda`, { method: "GET" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function postAgenda(judul, tanggal, lokasi) {
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ judul, tanggal, lokasi }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function putAgenda(id, judul, tanggal, lokasi) {
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ judul, tanggal, lokasi }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function deleteAgenda(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}

// ── BERITA UTAMA (pinned/featured) ───────────────────────────
async function getBeritaUtama() {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita-utama`, { method: "GET" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function postBeritaUtama(judul, ringkasan, tanggal, gambarFile) {
  const fd = new FormData();
  fd.append("judul", judul);
  fd.append("ringkasan", ringkasan);
  if (tanggal) fd.append("tanggal", tanggal);
  if (gambarFile) fd.append("gambar", gambarFile);
  const res = await apiHelper.fetchData(`${BASE_URL}/berita-utama`, { method: "POST", body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function putBeritaUtama(id, judul, ringkasan, tanggal, gambarFile) {
  const fd = new FormData();
  if (judul) fd.append("judul", judul);
  if (ringkasan) fd.append("ringkasan", ringkasan);
  if (tanggal) fd.append("tanggal", tanggal);
  if (gambarFile) fd.append("gambar", gambarFile);
  const res = await apiHelper.fetchData(`${BASE_URL}/berita-utama/${id}`, { method: "PUT", body: fd });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}
async function deleteBeritaUtama(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita-utama/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal"); }
  return res.json();
}

const beritaApi = {
  getBerita, postBerita, putBerita, deleteBerita,
  getPengumuman, postPengumuman, putPengumuman, deletePengumuman,
  getAgenda, postAgenda, putAgenda, deleteAgenda,
  getBeritaUtama, postBeritaUtama, putBeritaUtama, deleteBeritaUtama,
};

export default beritaApi;