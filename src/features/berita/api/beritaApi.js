// src/features/berita/api/beritaApi.js
import apiHelper, { BASE_URL } from "../../../helpers/apiHelper";

// ─── Helper: extract array from paginated or plain response ──────────────────
function extractArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  return [];
}

// ─── BERITA (/api/berita) ─────────────────────────────────────────────────────
// DB table : news
// Fields   : title, content, description, excerpt, slug, imageUrl,
//            author, views, isFeatured, isActive, createdAt, updatedAt, categoryId
// GET returns paginated: { data: [...], total, page, limit }

async function getBerita() {
  // fetch up to 200 items so admin always sees everything
  const res = await apiHelper.fetchData(`${BASE_URL}/berita?page=1&limit=200`, {
    method: "GET",
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memuat berita"); }
  return extractArray(await res.json());
}

async function postBerita(title, content, description, imageFile) {
  const fd = new FormData();
  fd.append("title", title);
  fd.append("content", content || "");
  fd.append("description", description || "");
  // slug is required by the backend — generate from title + timestamp
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-") +
    "-" + Date.now();
  fd.append("slug", slug);
  fd.append("author", "Admin");
  if (imageFile) fd.append("image", imageFile);

  const res = await apiHelper.fetchData(`${BASE_URL}/berita`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menambah berita"); }
  return res.json();
}

async function putBerita(id, title, content, description, imageFile) {
  const fd = new FormData();
  if (title)       fd.append("title", title);
  if (content)     fd.append("content", content);
  if (description) fd.append("description", description);
  if (imageFile)   fd.append("image", imageFile);

  const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, {
    method: "PUT",
    body: fd,
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal memperbarui berita"); }
  return res.json();
}

async function deleteBerita(id) {
  const res = await apiHelper.fetchData(`${BASE_URL}/berita/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menghapus berita"); }
  return res.json();
}

// ─── AGENDA (/api/agenda) ─────────────────────────────────────────────────────
// DB table : schedules
// Fields   : title, description, date, startTime, endTime,
//            location, participants, category, imageUrl, isActive

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
  const res = await apiHelper.fetchData(`${BASE_URL}/agenda/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menghapus agenda"); }
  return res.json();
}

// ─── PENGUMUMAN (/api/pengumuman) ─────────────────────────────────────────────
// DB table : announcements
// Fields   : title, content, description, imageUrl, type, author, isActive, expiredAt

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
  const res = await apiHelper.fetchData(`${BASE_URL}/pengumuman/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.message || "Gagal menghapus pengumuman"); }
  return res.json();
}

const beritaApi = {
  getBerita, postBerita, putBerita, deleteBerita,
  getAgenda, postAgenda, putAgenda, deleteAgenda,
  getPengumuman, postPengumuman, putPengumuman, deletePengumuman,
};

export default beritaApi;