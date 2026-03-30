// src/features/admin/pages/AdminBeritaPage.jsx
// Halaman admin lengkap untuk Berita & Informasi
// Mencakup: Berita Terbaru, Berita Utama, Pengumuman, Agenda Sekolah

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
} from "../components/AdminComponents";
import { AdminStatCard } from "../components/AdminComponents";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import useInput from "../../../hooks/useInput";
import {
  asyncGetBerita,
  asyncPostBerita,
  asyncPutBerita,
  asyncDeleteBerita,
  asyncGetPengumuman,
  asyncPostPengumuman,
  asyncPutPengumuman,
  asyncDeletePengumuman,
  asyncGetAgenda,
  asyncPostAgenda,
  asyncPutAgenda,
  asyncDeleteAgenda,
  asyncGetBeritaUtama,
  asyncPostBeritaUtama,
  asyncPutBeritaUtama,
  asyncDeleteBeritaUtama,
} from "../../berita/states/action";

// ── Badge Kategori ────────────────────────────────────────────
function KategoriBadge({ kategori }) {
  const map = {
    AKADEMIK:   ["smk-admin-badge-blue",   "📚 Akademik"],
    PRESTASI:   ["smk-admin-badge-gold",   "🏆 Prestasi"],
    KEGIATAN:   ["smk-admin-badge-silver", "📅 Kegiatan"],
    PENGUMUMAN: ["smk-admin-badge-red",    "📢 Pengumuman"],
    KABAR:      ["smk-admin-badge-bronze", "📰 Kabar"],
  };
  const key = kategori?.toUpperCase();
  const [cls, label] = map[key] ?? ["smk-admin-badge-blue", kategori];
  return <span className={`smk-admin-badge ${cls}`}>{label}</span>;
}

// ── Format tanggal ────────────────────────────────────────────
function formatTanggal(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ── Tab Nav ───────────────────────────────────────────────────
function TabNav({ tabs, active, onChange }) {
  return (
    <div className="smk-admin-tab-nav">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`smk-admin-tab-btn${active === t.key ? " active" : ""}`}
          onClick={() => onChange(t.key)}
        >
          <span className="smk-admin-tab-icon">{t.icon}</span>
          {t.label}
          {t.count !== undefined && (
            <span className="smk-admin-tab-count">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function AdminBeritaPage() {
  const dispatch = useDispatch();
  const berita      = useSelector((s) => s.berita ?? []);
  const pengumuman  = useSelector((s) => s.pengumuman ?? []);
  const agenda      = useSelector((s) => s.agenda ?? []);
  const beritaUtama = useSelector((s) => s.beritaUtama ?? []);
  const loading     = useSelector((s) => s.beritaLoading ?? false);

  const [activeTab, setActiveTab] = useState("berita");

  useEffect(() => {
    dispatch(asyncGetBerita());
    dispatch(asyncGetPengumuman());
    dispatch(asyncGetAgenda());
    dispatch(asyncGetBeritaUtama());
  }, [dispatch]);

  const tabs = [
    { key: "berita",       icon: "📰", label: "Berita Terbaru",   count: berita.length },
    { key: "beritaUtama",  icon: "⭐", label: "Berita Utama",     count: beritaUtama.length },
    { key: "pengumuman",   icon: "📢", label: "Pengumuman",       count: pengumuman.length },
    { key: "agenda",       icon: "📅", label: "Agenda Sekolah",   count: agenda.length },
  ];

  return (
    <AdminLayout title="Berita & Informasi">
      {/* ── STATS ── */}
      <div className="smk-admin-stats-row" style={{ marginBottom: 28 }}>
        <AdminStatCard icon="📰" value={berita.length}      label="Total Berita"     color="blue"   />
        <AdminStatCard icon="⭐" value={beritaUtama.length}  label="Berita Utama"     color="gold"   />
        <AdminStatCard icon="📢" value={pengumuman.length}   label="Pengumuman"       color="orange" />
        <AdminStatCard icon="📅" value={agenda.length}       label="Agenda Sekolah"   color="teal"   />
      </div>

      {/* ── TAB NAV ── */}
      <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ── TAB CONTENT ── */}
      {activeTab === "berita"      && <BeritaTab      data={berita}      loading={loading} dispatch={dispatch} />}
      {activeTab === "beritaUtama" && <BeritaUtamaTab data={beritaUtama} loading={loading} dispatch={dispatch} />}
      {activeTab === "pengumuman"  && <PengumumanTab  data={pengumuman}  loading={loading} dispatch={dispatch} />}
      {activeTab === "agenda"      && <AgendaTab      data={agenda}      loading={loading} dispatch={dispatch} />}
    </AdminLayout>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 1 — BERITA TERBARU
// ════════════════════════════════════════════════════════════════
function BeritaTab({ data, loading, dispatch }) {
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [judul, setJudul]           = useInput("");
  const [isi, setIsi]               = useInput("");
  const [tanggal, setTanggal]       = useInput("");
  const [kategori, setKategori]     = useState("AKADEMIK");

  const openAdd = () => {
    setEditItem(null);
    setJudul({ target: { value: "" } });
    setIsi({ target: { value: "" } });
    setTanggal({ target: { value: new Date().toISOString().split("T")[0] } });
    setKategori("AKADEMIK");
    setFile(null); setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setJudul({ target: { value: item.judul } });
    setIsi({ target: { value: item.isi ?? "" } });
    setTanggal({ target: { value: item.tanggal?.split("T")[0] ?? "" } });
    setKategori(item.kategori ?? "AKADEMIK");
    setFile(null);
    setPreview(item.gambar ? mediaUrl(item.gambar) : null);
    setModalOpen(true);
  };

  const handleFile = (f) => { setFile(f); if (f) setPreview(URL.createObjectURL(f)); };

  const handleSubmit = () => {
    if (!judul) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem)
      dispatch(asyncPutBerita(editItem.id, judul, isi, kategori, tanggal, file, cb));
    else
      dispatch(asyncPostBerita(judul, isi, kategori, tanggal, file, cb));
    setTimeout(() => setSubmitting(false), 5000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus berita "${item.judul}"?`);
    if (r.isConfirmed) dispatch(asyncDeleteBerita(item.id));
  };

  return (
    <>
      <AdminCard
        title="📰 Berita Terbaru"
        subtitle="Kelola artikel berita sekolah yang tampil di halaman Berita & Informasi"
        onAdd={openAdd}
      >
        <AdminTable
          columns={["Gambar", "Judul", "Kategori", "Tanggal", "Pratinjau Isi", "Aksi"]}
          loading={loading}
          empty={!data.length}
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td><AdminThumb src={mediaUrl(item.gambar)} fallback="📰" /></td>
              <td>
                <strong style={{ display: "block", maxWidth: 200 }}>{item.judul}</strong>
              </td>
              <td><KategoriBadge kategori={item.kategori} /></td>
              <td style={{ whiteSpace: "nowrap", fontSize: 12, color: "var(--text-gray)" }}>
                📅 {formatTanggal(item.tanggal)}
              </td>
              <td className="smk-admin-td-truncate" style={{ maxWidth: 220, fontSize: 13, color: "var(--text-gray)" }}>
                {item.isi?.replace(/<[^>]+>/g, "")?.slice(0, 80)}...
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
        title={editItem ? "✏️ Edit Berita" : "➕ Tambah Berita"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="smk-form-group">
          <label>Judul Berita <span style={{ color: "red" }}>*</span></label>
          <input
            className="smk-form-input"
            type="text"
            value={judul}
            onChange={setJudul}
            placeholder="contoh: SMK N3 Balige Raih Juara Nasional"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="smk-form-group">
            <label>Kategori</label>
            <select className="smk-form-input" value={kategori} onChange={(e) => setKategori(e.target.value)}>
              <option value="AKADEMIK">📚 Akademik</option>
              <option value="PRESTASI">🏆 Prestasi</option>
              <option value="KEGIATAN">📅 Kegiatan</option>
              <option value="PENGUMUMAN">📢 Pengumuman</option>
              <option value="KABAR">📰 Kabar Sekolah</option>
            </select>
          </div>
          <div className="smk-form-group">
            <label>Tanggal</label>
            <input
              className="smk-form-input"
              type="date"
              value={tanggal}
              onChange={setTanggal}
            />
          </div>
        </div>

        <div className="smk-form-group">
          <label>Isi / Ringkasan Berita</label>
          <textarea
            className="smk-form-input"
            rows={5}
            value={isi}
            onChange={setIsi}
            placeholder="Tulis isi atau ringkasan berita di sini..."
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

// ════════════════════════════════════════════════════════════════
// TAB 2 — BERITA UTAMA (FEATURED)
// ════════════════════════════════════════════════════════════════
function BeritaUtamaTab({ data, loading, dispatch }) {
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [judul, setJudul]           = useInput("");
  const [ringkasan, setRingkasan]   = useInput("");
  const [tanggal, setTanggal]       = useInput("");

  const openAdd = () => {
    setEditItem(null);
    setJudul({ target: { value: "" } });
    setRingkasan({ target: { value: "" } });
    setTanggal({ target: { value: new Date().toISOString().split("T")[0] } });
    setFile(null); setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setJudul({ target: { value: item.judul } });
    setRingkasan({ target: { value: item.ringkasan ?? "" } });
    setTanggal({ target: { value: item.tanggal?.split("T")[0] ?? "" } });
    setFile(null);
    setPreview(item.gambar ? mediaUrl(item.gambar) : null);
    setModalOpen(true);
  };

  const handleFile = (f) => { setFile(f); if (f) setPreview(URL.createObjectURL(f)); };

  const handleSubmit = () => {
    if (!judul) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem)
      dispatch(asyncPutBeritaUtama(editItem.id, judul, ringkasan, tanggal, file, cb));
    else
      dispatch(asyncPostBeritaUtama(judul, ringkasan, tanggal, file, cb));
    setTimeout(() => setSubmitting(false), 5000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus berita utama "${item.judul}"?`);
    if (r.isConfirmed) dispatch(asyncDeleteBeritaUtama(item.id));
  };

  return (
    <>
      {/* Info Banner */}
      <div className="smk-admin-info-banner">
        <span className="smk-admin-info-banner-icon">⭐</span>
        <div>
          <strong>Berita Utama</strong> adalah berita yang ditampilkan paling menonjol di halaman
          Berita & Informasi. Disarankan hanya ada <strong>1 berita utama</strong> aktif.
        </div>
      </div>

      <AdminCard
        title="⭐ Berita Utama (Featured)"
        subtitle="Berita yang tampil paling besar dan menonjol di halaman Berita & Informasi"
        onAdd={openAdd}
      >
        <AdminTable
          columns={["Gambar", "Judul", "Ringkasan", "Tanggal", "Aksi"]}
          loading={loading}
          empty={!data.length}
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <AdminThumb src={mediaUrl(item.gambar)} fallback="⭐" />
              </td>
              <td>
                <strong style={{ display: "block", maxWidth: 200 }}>{item.judul}</strong>
              </td>
              <td className="smk-admin-td-truncate" style={{ maxWidth: 240, fontSize: 13, color: "var(--text-gray)" }}>
                {item.ringkasan?.slice(0, 90)}...
              </td>
              <td style={{ whiteSpace: "nowrap", fontSize: 12, color: "var(--text-gray)" }}>
                📅 {formatTanggal(item.tanggal)}
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
        title={editItem ? "✏️ Edit Berita Utama" : "➕ Tambah Berita Utama"}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <div className="smk-form-group">
          <label>Judul Berita Utama <span style={{ color: "red" }}>*</span></label>
          <input
            className="smk-form-input"
            type="text"
            value={judul}
            onChange={setJudul}
            placeholder="contoh: SMK N3 Balige Raih Akreditasi A dari BAN-SM"
          />
        </div>
        <div className="smk-form-group">
          <label>Tanggal</label>
          <input className="smk-form-input" type="date" value={tanggal} onChange={setTanggal} />
        </div>
        <div className="smk-form-group">
          <label>Ringkasan / Deskripsi Singkat</label>
          <textarea
            className="smk-form-input"
            rows={4}
            value={ringkasan}
            onChange={setRingkasan}
            placeholder="Tulis ringkasan berita utama (2-3 kalimat)..."
          />
        </div>
        <UploadArea
          id="beritaUtamaGambar"
          onFile={handleFile}
          preview={preview}
          label="Pilih gambar berita utama"
        />
      </AdminModal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 3 — PENGUMUMAN
// ════════════════════════════════════════════════════════════════
function PengumumanTab({ data, loading, dispatch }) {
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [judul, setJudul]           = useInput("");
  const [isi, setIsi]               = useInput("");

  const openAdd = () => {
    setEditItem(null);
    setJudul({ target: { value: "" } });
    setIsi({ target: { value: "" } });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setJudul({ target: { value: item.judul } });
    setIsi({ target: { value: item.isi ?? "" } });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!judul) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem)
      dispatch(asyncPutPengumuman(editItem.id, judul, isi, cb));
    else
      dispatch(asyncPostPengumuman(judul, isi, cb));
    setTimeout(() => setSubmitting(false), 3000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus pengumuman "${item.judul}"?`);
    if (r.isConfirmed) dispatch(asyncDeletePengumuman(item.id));
  };

  return (
    <>
      <AdminCard
        title="📢 Pengumuman"
        subtitle="Kelola pengumuman resmi sekolah yang tampil di halaman Berita & Informasi"
        onAdd={openAdd}
      >
        <AdminTable
          columns={["#", "Judul Pengumuman", "Isi / Keterangan", "Aksi"]}
          loading={loading}
          empty={!data.length}
        >
          {data.map((item, idx) => (
            <tr key={item.id}>
              <td>
                <div className="smk-admin-peng-number">{idx + 1}</div>
              </td>
              <td>
                <strong>{item.judul}</strong>
              </td>
              <td className="smk-admin-td-truncate" style={{ maxWidth: 320, fontSize: 13, color: "var(--text-gray)" }}>
                {item.isi?.slice(0, 100)}...
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
            value={judul}
            onChange={setJudul}
            placeholder="contoh: Informasi PPDB Tahun Ajaran 2026/2027"
          />
        </div>
        <div className="smk-form-group">
          <label>Isi Pengumuman</label>
          <textarea
            className="smk-form-input"
            rows={5}
            value={isi}
            onChange={setIsi}
            placeholder="Tulis isi pengumuman secara lengkap..."
          />
        </div>
      </AdminModal>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// TAB 4 — AGENDA SEKOLAH
// ════════════════════════════════════════════════════════════════
function AgendaTab({ data, loading, dispatch }) {
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [judul, setJudul]           = useInput("");
  const [tanggal, setTanggal]       = useInput("");
  const [lokasi, setLokasi]         = useInput("");

  const openAdd = () => {
    setEditItem(null);
    setJudul({ target: { value: "" } });
    setTanggal({ target: { value: new Date().toISOString().split("T")[0] } });
    setLokasi({ target: { value: "" } });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setJudul({ target: { value: item.judul } });
    setTanggal({ target: { value: item.tanggal?.split("T")[0] ?? "" } });
    setLokasi({ target: { value: item.lokasi ?? "" } });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!judul || !tanggal) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem)
      dispatch(asyncPutAgenda(editItem.id, judul, tanggal, lokasi, cb));
    else
      dispatch(asyncPostAgenda(judul, tanggal, lokasi, cb));
    setTimeout(() => setSubmitting(false), 3000);
  };

  const handleDelete = async (item) => {
    const r = await showConfirmDialog(`Hapus agenda "${item.judul}"?`);
    if (r.isConfirmed) dispatch(asyncDeleteAgenda(item.id));
  };

  // Sort by date
  const sorted = [...data].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  return (
    <>
      <AdminCard
        title="📅 Agenda Sekolah"
        subtitle="Kelola jadwal dan agenda kegiatan sekolah yang tampil di halaman Berita & Informasi"
        onAdd={openAdd}
      >
        <AdminTable
          columns={["Tanggal", "Judul Agenda", "Lokasi / Keterangan", "Aksi"]}
          loading={loading}
          empty={!sorted.length}
        >
          {sorted.map((item) => {
            const d = item.tanggal ? new Date(item.tanggal) : null;
            const tgl = d ? String(d.getDate()).padStart(2, "0") : "—";
            const bln = d ? d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase() : "—";
            const isPast = d && d < new Date();

            return (
              <tr key={item.id} style={{ opacity: isPast ? 0.6 : 1 }}>
                <td>
                  <div className="smk-admin-agenda-date-pill">
                    <span className="smk-admin-agenda-day">{tgl}</span>
                    <span className="smk-admin-agenda-mon">{bln}</span>
                  </div>
                </td>
                <td>
                  <strong>{item.judul}</strong>
                  {isPast && (
                    <span className="smk-admin-badge smk-admin-badge-silver" style={{ marginLeft: 8, fontSize: 10 }}>
                      Selesai
                    </span>
                  )}
                </td>
                <td style={{ fontSize: 13, color: "var(--text-gray)" }}>
                  📍 {item.lokasi || "—"}
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
            value={judul}
            onChange={setJudul}
            placeholder="contoh: Rapat Wali Murid Kelas X"
          />
        </div>
        <div className="smk-form-group">
          <label>Tanggal <span style={{ color: "red" }}>*</span></label>
          <input
            className="smk-form-input"
            type="date"
            value={tanggal}
            onChange={setTanggal}
          />
        </div>
        <div className="smk-form-group">
          <label>Lokasi / Keterangan Waktu</label>
          <input
            className="smk-form-input"
            type="text"
            value={lokasi}
            onChange={setLokasi}
            placeholder="contoh: Aula SMK N 3 Balige, 08.00 WIB"
          />
        </div>
      </AdminModal>
    </>
  );
}
