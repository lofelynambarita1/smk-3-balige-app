// src/features/berita/api/beritaApi.js
import apiHelper, { BASE_URL } from "../../../helpers/apiHelper";

// ─── Helper: extract array from paginated or plain response ──────────────────
function extractArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
}

// ─── Helper: coba request, kembalikan { ok, data } atau { ok, error } ────────
async function tryRequest(url, method, fd) {
  const res = await apiHelper.fetchData(url, { method, body: fd });
  if (res.ok) return { ok: true, data: await res.json() };
  const text = await res.text();
  let errMsg = "Gagal";
  try { errMsg = JSON.parse(text)?.message || errMsg; } catch { errMsg = text || errMsg; }
  return { ok: false, error: errMsg };
}

// ─── Helper: buat FormData dasar berita (tanpa file) ─────────────────────────
function buildBeritaFd({ title, content, description, slug, forPut = false }) {
  const fd = new FormData();
  if (!forPut) {
    fd.append("title", title);
    fd.append("content", content || "");
    fd.append("description", description || "");
    fd.append("slug", slug || "");
    fd.append("author", "Admin");
  } else {
    if (title)       fd.append("title", title);
    if (content)     fd.append("content", content);
    if (description) fd.append("description", description);
  }
  return fd;
}

// ─── BERITA (/api/berita) ─────────────────────────────────────────────────────
async function getBerita() {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita?page=1&limit=200`, {
    method: "GET",
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memuat berita"); }
  return extractArray(await res.json());
}

async function postBerita(title, content, description, imageFile) {
  const slug =
    title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-") +
    "-" + Date.now();

  // Tanpa file — langsung kirim
  if (!imageFile) {
    const fd = buildBeritaFd({ title, content, description, slug });
    const res = await apiHelper.fetchData(`${BASE_URL}/berita`, { method: "POST", body: fd });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menambah berita"); }
    return res.json();
  }

  // ✅ FIX: field name yang benar sesuai FileInterceptor('gambar') di backend
  const fd = buildBeritaFd({ title, content, description, slug });
  fd.append("gambar", imageFile);

  const res = await apiHelper.fetchData(`${BASE_URL}/berita`, { method: "POST", body: fd });
  if (!res.ok) {
    const text = await res.text();
    let errMsg = "Gagal menambah berita";
    try { errMsg = JSON.parse(text)?.message || errMsg; } catch { errMsg = text || errMsg; }
    throw new Error(errMsg);
  }
  return res.json();
}

async function putBerita(id, title, content, description, imageFile) {
  // Tanpa file baru
  if (!imageFile) {
    const fd = buildBeritaFd({ title, content, description, forPut: true });
    const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, { method: "PUT", body: fd });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memperbarui berita"); }
    return res.json();
  }

  // ✅ FIX: field name yang benar sesuai FileInterceptor('gambar') di backend
  const fd = buildBeritaFd({ title, content, description, forPut: true });
  fd.append("gambar", imageFile);

  const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, { method: "PUT", body: fd });
  if (!res.ok) {
    const text = await res.text();
    let errMsg = "Gagal memperbarui berita";
    try { errMsg = JSON.parse(text)?.message || errMsg; } catch { errMsg = text || errMsg; }
    throw new Error(errMsg);
  }
  return res.json();
}

async function deleteBerita(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menghapus berita"); }
  return res.json();
}

// ─── AGENDA (/api/agenda) ─────────────────────────────────────────────────────
async function getAgenda() {
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda`, { method: "GET" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memuat agenda"); }
  return extractArray(await res.json());
}

async function postAgenda(title, date, location) {
  const body = { title, date };
  if (location) body.location = location;
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menambah agenda"); }
  return res.json();
}

async function putAgenda(id, title, date, location) {
  const body = { title, date };
  if (location) body.location = location;
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memperbarui agenda"); }
  return res.json();
}

async function deleteAgenda(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menghapus agenda"); }
  return res.json();
}

// ─── PENGUMUMAN (/api/pengumuman) ─────────────────────────────────────────────
async function getPengumuman() {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman`, { method: "GET" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memuat pengumuman"); }
  return extractArray(await res.json());
}

async function postPengumuman(title, content) {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content: content || "" }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menambah pengumuman"); }
  return res.json();
}

async function putPengumuman(id, title, content) {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content: content || "" }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memperbarui pengumuman"); }
  return res.json();
}

async function deletePengumuman(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman/${id}`, { method: "DELETE" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menghapus pengumuman"); }
  return res.json();
}

const beritaApi = {
  getBerita, postBerita, putBerita, deleteBerita,
  getAgenda, postAgenda, putAgenda, deleteAgenda,
  getPengumuman, postPengumuman, putPengumuman, deletePengumuman,
};

export default beritaApi;