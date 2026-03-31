// src/features/admin/pages/AdminBeritaPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../layouts/AdminLayout";
import {
  AdminCard,
  AdminTable,
  AdminModal,
  AdminThumb,
  ActionButtons,
  UploadArea,
  mediaUrl,
  AdminStatCard,
} from "../components/AdminComponents";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import useInput from "../../../hooks/useInput";
import {
  asyncGetBerita,
  asyncPostBerita,
  asyncPutBerita,
  asyncDeleteBerita,
  asyncGetAgenda,
  asyncPostAgenda,
  asyncPutAgenda,
  asyncDeleteAgenda,
  asyncGetPengumuman,
  asyncPostPengumuman,
  asyncPutPengumuman,
  asyncDeletePengumuman,
  asyncLoadAllBeritaData,
} from "../../berita/states/action";

// ── Utility ───────────────────────────────────────────────────────────────────
function formatTgl(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return str; }
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function AdminBeritaPage() {
  const dispatch   = useDispatch();
  // Redux state keys defined in store.js
  const berita     = useSelector((s) => s.berita     || []);
  const agenda     = useSelector((s) => s.agenda     || []);
  const pengumuman = useSelector((s) => s.pengumuman || []);
  const loading    = useSelector((s) => s.beritaLoading || false);
  const [activeTab, setActiveTab] = useState("berita");

  useEffect(() => { dispatch(asyncLoadAllBeritaData()); }, [dispatch]);

  const tabs = [
    { key: "berita",     icon: "📰", label: "Berita Terbaru",  count: berita.length      },
    { key: "pengumuman", icon: "📢", label: "Pengumuman",      count: pengumuman.length   },
    { key: "agenda",     icon: "📅", label: "Agenda Sekolah",  count: agenda.length       },
  ];

  return (
    <AdminLayout title="Berita & Informasi">
      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <div className="smk-admin-stats-row" style={{ marginBottom: 24 }}>
        <AdminStatCard icon="📰" value={berita.length}     label="Total Berita"   color="blue"   />
        <AdminStatCard icon="📢" value={pengumuman.length}  label="Pengumuman"     color="purple" />
        <AdminStatCard icon="📅" value={agenda.length}      label="Agenda Sekolah" color="teal"   />
      </div>

      {/* ── TABS ──────────────────────────────────────────────────────────── */}
      <div className="smk-admin-tab-nav">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`smk-admin-tab-btn${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span className="smk-admin-tab-icon">{t.icon}</span>
            {t.label}
            <span className="smk-admin-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      {activeTab === "berita"     && <BeritaTab     data={berita}     loading={loading} dispatch={dispatch} />}
      {activeTab === "pengumuman" && <PengumumanTab data={pengumuman} loading={loading} dispatch={dispatch} />}
      {activeTab === "agenda"     && <AgendaTab     data={agenda}     loading={loading} dispatch={dispatch} />}
    </AdminLayout>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB: BERITA
// Backend table : news
// Response keys : id, title, content, description, excerpt, slug,
//                 imageUrl, author, views, isFeatured, isActive, createdAt
// ═════════════════════════════════════════════════════════════════════════════
function BeritaTab({ data, loading, dispatch }) {
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [file,        setFile]        = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [title,       setTitle]       = useInput("");
  const [content,     setContent]     = useInput("");
  const [description, setDescription] = useInput("");
  const [search,      setSearch]      = useState("");

  // ── Filter by title or description ──────────────────────────────────────
  const filtered = data.filter((b) => {
    const q = search.toLowerCase();
    return (
      (b.title       || "").toLowerCase().includes(q) ||
      (b.description || "").toLowerCase().includes(q) ||
      (b.excerpt     || "").toLowerCase().includes(q)
    );
  });

  // ── Open add modal ───────────────────────────────────────────────────────
  const openAdd = () => {
    setEditItem(null);
    setTitle({       target: { value: "" } });
    setContent({     target: { value: "" } });
    setDescription({ target: { value: "" } });
    setFile(null);
    setPreview(null);
    setModalOpen(true);
  };

  // ── Open edit modal ──────────────────────────────────────────────────────
  const openEdit = (item) => {
    setEditItem(item);
    setTitle({       target: { value: item.title       || "" } });
    setContent({     target: { value: item.content     || "" } });
    setDescription({ target: { value: item.description || item.excerpt || "" } });
    setFile(null);
    setPreview(item.imageUrl ? mediaUrl(item.imageUrl) : null);
    setModalOpen(true);
  };

  const handleFile = (f) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem)
      dispatch(asyncPutBerita(editItem.id, title, content, description, file, cb));
    else
      dispatch(asyncPostBerita(title, content, description, file, cb));
    // safety timeout
    setTimeout(() => setSubmitting(false), 8000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus berita "${item.title}"?`);
    if (r.isConfirmed) dispatch(asyncDeleteBerita(item.id));
  };

  return (
    <>
      <AdminCard
        title="📰 Daftar Berita"
        subtitle="Kelola semua artikel berita sekolah"
        onAdd={openAdd}
      >
        {/* ── Search ── */}
        <div style={{ marginBottom: 16 }}>
          <input
            className="smk-form-input"
            placeholder="🔍 Cari judul atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 380 }}
          />
        </div>

        {/* ── Table ── */}
        <AdminTable
          columns={["Gambar", "Judul", "Deskripsi / Ringkasan", "Tanggal", "Aksi"]}
          loading={loading}
          empty={filtered.length === 0}
        >
          {filtered.map((item) => (
            <tr key={item.id}>
              {/* Gambar */}
              <td>
                <AdminThumb src={mediaUrl(item.imageUrl)} fallback="📰" />
              </td>

              {/* Judul */}
              <td>
                <strong style={{ fontSize: 13 }}>{item.title}</strong>
                {item.author && (
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    ✍️ {item.author}
                  </div>
                )}
              </td>

              {/* Deskripsi */}
              <td
                className="smk-admin-td-truncate"
                style={{ maxWidth: 240, fontSize: 12, color: "#9ca3af" }}
              >
                {(item.description || item.excerpt || item.content || "").slice(0, 90)}
              </td>

              {/* Tanggal */}
              <td style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
                📅 {formatTgl(item.createdAt)}
              </td>

              {/* Aksi */}
              <td>
                <ActionButtons
                  onEdit={() => openEdit(item)}
                  onDelete={() => handleDelete(item)}
                />
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>

      {/* ── Modal Add / Edit ── */}
      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "✏️ Edit Berita" : "➕ Tambah Berita"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="smk-form-group">
          <label>Judul Berita <span style={{ color: "red" }}>*</span></label>
          <input
            className="smk-form-input"
            type="text"
            value={title}
            onChange={setTitle}
            placeholder="contoh: SMK N3 Balige Raih Juara Nasional"
          />
        </div>

        <div className="smk-form-group">
          <label>Deskripsi / Ringkasan</label>
          <input
            className="smk-form-input"
            type="text"
            value={description}
            onChange={setDescription}
            placeholder="Ringkasan singkat (1–2 kalimat)"
          />
        </div>

        <div className="smk-form-group">
          <label>Isi Berita</label>
          <textarea
            className="smk-form-input"
            rows={5}
            value={content}
            onChange={setContent}
            placeholder="Tulis isi berita lengkap di sini..."
          />
        </div>

        <UploadArea
          id="beritaGambar"
          onFile={handleFile}
          preview={preview}
          label="Pilih gambar berita (opsional)"
        />
      </AdminModal>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB: PENGUMUMAN
// Backend table : announcements
// Response keys : id, title, content, description, type, author, isActive, createdAt
// ═════════════════════════════════════════════════════════════════════════════
function PengumumanTab({ data, loading, dispatch }) {
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [title,      setTitle]      = useInput("");
  const [content,    setContent]    = useInput("");

  const openAdd = () => {
    setEditItem(null);
    setTitle({   target: { value: "" } });
    setContent({ target: { value: "" } });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setTitle({   target: { value: item.title   || "" } });
    setContent({ target: { value: item.content || item.description || "" } });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem) dispatch(asyncPutPengumuman(editItem.id, title, content, cb));
    else          dispatch(asyncPostPengumuman(title, content, cb));
    setTimeout(() => setSubmitting(false), 5000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus pengumuman "${item.title}"?`);
    if (r.isConfirmed) dispatch(asyncDeletePengumuman(item.id));
  };

  return (
    <>
      <AdminCard
        title="📢 Pengumuman"
        subtitle="Kelola pengumuman resmi sekolah"
        onAdd={openAdd}
      >
        <AdminTable
          columns={["#", "Judul Pengumuman", "Isi / Keterangan", "Aksi"]}
          loading={loading}
          empty={data.length === 0}
        >
          {data.map((item, idx) => (
            <tr key={item.id}>
              <td><div className="smk-admin-peng-number">{idx + 1}</div></td>
              <td><strong>{item.title}</strong></td>
              <td
                className="smk-admin-td-truncate"
                style={{ maxWidth: 320, fontSize: 13, color: "#6b7280" }}
              >
                {(item.content || item.description || "").slice(0, 100)}
              </td>
              <td>
                <ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item)} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminCard>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "✏️ Edit Pengumuman" : "➕ Tambah Pengumuman"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="smk-form-group">
          <label>Judul Pengumuman <span style={{ color: "red" }}>*</span></label>
          <input
            className="smk-form-input"
            type="text"
            value={title}
            onChange={setTitle}
            placeholder="contoh: Informasi PPDB Tahun Ajaran 2026/2027"
          />
        </div>
        <div className="smk-form-group">
          <label>Isi Pengumuman</label>
          <textarea
            className="smk-form-input"
            rows={5}
            value={content}
            onChange={setContent}
            placeholder="Tulis isi pengumuman secara lengkap..."
          />
        </div>
      </AdminModal>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB: AGENDA
// Backend table : schedules
// Response keys : id, title, description, date, startTime, endTime,
//                 location, participants, category, imageUrl, isActive, createdAt
// ═════════════════════════════════════════════════════════════════════════════
function AgendaTab({ data, loading, dispatch }) {
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [title,      setTitle]      = useInput("");
  const [date,       setDate]       = useInput("");
  const [location,   setLocation]   = useInput("");

  // Sort by date ascending
  const sorted = [...data].sort(
    (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
  );

  const openAdd = () => {
    setEditItem(null);
    setTitle({    target: { value: "" } });
    setDate({     target: { value: new Date().toISOString().slice(0, 10) } });
    setLocation({ target: { value: "" } });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setTitle({    target: { value: item.title    || "" } });
    setDate({     target: { value: (item.date    || "").slice(0, 10) } });
    setLocation({ target: { value: item.location || "" } });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !date) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem)
      dispatch(asyncPutAgenda(editItem.id, title, date, location, cb));
    else
      dispatch(asyncPostAgenda(title, date, location, cb));
    setTimeout(() => setSubmitting(false), 5000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus agenda "${item.title}"?`);
    if (r.isConfirmed) dispatch(asyncDeleteAgenda(item.id));
  };

  return (
    <>
      <AdminCard
        title="📅 Agenda Sekolah"
        subtitle="Kelola jadwal dan agenda kegiatan sekolah"
        onAdd={openAdd}
      >
        <AdminTable
          columns={["Tanggal", "Judul Agenda", "Lokasi", "Aksi"]}
          loading={loading}
          empty={sorted.length === 0}
        >
          {sorted.map((item) => {
            const d    = item.date ? new Date(item.date) : null;
            const tgl  = d ? String(d.getDate()).padStart(2, "0") : "—";
            const bln  = d
              ? d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase()
              : "—";
            const past = d && d < new Date();
            return (
              <tr key={item.id} style={{ opacity: past ? 0.65 : 1 }}>
                <td>
                  <div className="smk-admin-agenda-date-pill">
                    <span className="smk-admin-agenda-day">{tgl}</span>
                    <span className="smk-admin-agenda-mon">{bln}</span>
                  </div>
                </td>
                <td>
                  <strong>{item.title}</strong>
                  {past && (
                    <span
                      className="smk-admin-badge smk-admin-badge-silver"
                      style={{ marginLeft: 8, fontSize: 10 }}
                    >
                      Selesai
                    </span>
                  )}
                </td>
                <td style={{ fontSize: 13, color: "#6b7280" }}>
                  {item.location ? `📍 ${item.location}` : "—"}
                </td>
                <td>
                  <ActionButtons onEdit={() => openEdit(item)} onDelete={() => handleDelete(item)} />
                </td>
              </tr>
            );
          })}
        </AdminTable>
      </AdminCard>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "✏️ Edit Agenda" : "➕ Tambah Agenda"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="smk-form-group">
          <label>Judul Agenda <span style={{ color: "red" }}>*</span></label>
          <input
            className="smk-form-input"
            type="text"
            value={title}
            onChange={setTitle}
            placeholder="contoh: Rapat Wali Murid Kelas X"
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="smk-form-group">
            <label>Tanggal <span style={{ color: "red" }}>*</span></label>
            <input
              className="smk-form-input"
              type="date"
              value={date}
              onChange={setDate}
            />
          </div>
          <div className="smk-form-group">
            <label>Lokasi / Keterangan</label>
            <input
              className="smk-form-input"
              type="text"
              value={location}
              onChange={setLocation}
              placeholder="contoh: Aula SMK, 08.00 WIB"
            />
          </div>
        </div>
      </AdminModal>
    </>
  );
}
