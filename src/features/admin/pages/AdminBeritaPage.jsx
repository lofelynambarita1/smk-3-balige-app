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

// ── Helpers ───────────────────────────────────────────────────
const KATEGORI_OPTIONS = [
  { value: "AKADEMIK",    label: "📚 Akademik"     },
  { value: "PRESTASI",    label: "🏆 Prestasi"     },
  { value: "KEGIATAN",    label: "📅 Kegiatan"     },
  { value: "PENGUMUMAN",  label: "📢 Pengumuman"   },
  { value: "KABAR",       label: "📰 Kabar Sekolah"},
];

const KATEGORI_COLOR = {
  AKADEMIK:   "#F59E0B",
  PRESTASI:   "#10B981",
  KEGIATAN:   "#3B82F6",
  PENGUMUMAN: "#8B5CF6",
  KABAR:      "#EF4444",
};

function KategoriBadge({ kategori }) {
  const color = KATEGORI_COLOR[kategori?.toUpperCase()] || "#6B7280";
  const label = KATEGORI_OPTIONS.find((k) => k.value === kategori?.toUpperCase())?.label || kategori;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: color + "22", color,
    }}>
      {label}
    </span>
  );
}

function formatTgl(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return str; }
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function AdminBeritaPage() {
  const dispatch   = useDispatch();
  const berita     = useSelector((s) => s.berita     || []);
  const agenda     = useSelector((s) => s.agenda     || []);
  const pengumuman = useSelector((s) => s.pengumuman || []);
  const loading    = useSelector((s) => s.beritaLoading || false);
  const [activeTab, setActiveTab] = useState("berita");

  useEffect(() => { dispatch(asyncLoadAllBeritaData()); }, [dispatch]);

  const tabs = [
    { key: "berita",     icon: "📰", label: "Berita Terbaru",  count: berita.length     },
    { key: "pengumuman", icon: "📢", label: "Pengumuman",      count: pengumuman.length  },
    { key: "agenda",     icon: "📅", label: "Agenda Sekolah",  count: agenda.length      },
  ];

  return (
    <AdminLayout title="Berita & Informasi">
      {/* STATS */}
      <div className="smk-admin-stats-row" style={{ marginBottom: 24 }}>
        <AdminStatCard icon="📰" value={berita.length}     label="Total Berita"    color="blue"   />
        <AdminStatCard icon="📢" value={pengumuman.length}  label="Pengumuman"      color="purple" />
        <AdminStatCard icon="📅" value={agenda.length}      label="Agenda Sekolah"  color="teal"   />
      </div>

      {/* TABS */}
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

      {/* CONTENT */}
      {activeTab === "berita"     && (
        <BeritaTab data={berita} loading={loading} dispatch={dispatch} />
      )}
      {activeTab === "pengumuman" && (
        <PengumumanTab data={pengumuman} loading={loading} dispatch={dispatch} />
      )}
      {activeTab === "agenda"     && (
        <AgendaTab data={agenda} loading={loading} dispatch={dispatch} />
      )}
    </AdminLayout>
  );
}

// ════════════════════════════════════════════════════════════
// TAB BERITA
// ════════════════════════════════════════════════════════════
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
  const [search, setSearch]         = useState("");

  const filtered = data.filter((b) =>
    b.judul?.toLowerCase().includes(search.toLowerCase()) ||
    b.kategori?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setJudul({ target: { value: "" } });
    setIsi({ target: { value: "" } });
    setTanggal({ target: { value: new Date().toISOString().slice(0, 10) } });
    setKategori("AKADEMIK");
    setFile(null); setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setJudul({ target: { value: item.judul } });
    setIsi({ target: { value: item.isi || "" } });
    setTanggal({ target: { value: item.tanggal?.slice(0, 10) || "" } });
    setKategori(item.kategori || "AKADEMIK");
    setFile(null);
    setPreview(item.gambar ? mediaUrl(item.gambar) : null);
    setModalOpen(true);
  };

  const handleFile = (f) => { setFile(f); if (f) setPreview(URL.createObjectURL(f)); };

  const handleSubmit = () => {
    if (!judul.trim()) return;
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
        title="📰 Daftar Berita"
        subtitle="Kelola semua artikel berita sekolah"
        onAdd={openAdd}
      >
        <div style={{ marginBottom: 16 }}>
          <input
            className="smk-form-input"
            placeholder="🔍 Cari judul atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360 }}
          />
        </div>
        <AdminTable
          columns={["Gambar", "Judul", "Kategori", "Tanggal", "Pratinjau Isi", "Aksi"]}
          loading={loading}
          empty={!filtered.length}
        >
          {filtered.map((item) => (
            <tr key={item.id}>
              <td><AdminThumb src={mediaUrl(item.gambar)} fallback="📰" /></td>
              <td><strong style={{ fontSize: 13 }}>{item.judul}</strong></td>
              <td><KategoriBadge kategori={item.kategori} /></td>
              <td style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
                📅 {formatTgl(item.tanggal)}
              </td>
              <td className="smk-admin-td-truncate" style={{ maxWidth: 200, fontSize: 12, color: "#9ca3af" }}>
                {item.isi?.slice(0, 70)}
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
          <input className="smk-form-input" type="text" value={judul} onChange={setJudul}
            placeholder="contoh: SMK N3 Balige Raih Juara Nasional" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="smk-form-group">
            <label>Kategori</label>
            <select className="smk-form-input" value={kategori} onChange={(e) => setKategori(e.target.value)}>
              {KATEGORI_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>
          <div className="smk-form-group">
            <label>Tanggal</label>
            <input className="smk-form-input" type="date" value={tanggal} onChange={setTanggal} />
          </div>
        </div>
        <div className="smk-form-group">
          <label>Isi / Ringkasan Berita</label>
          <textarea className="smk-form-input" rows={5} value={isi} onChange={setIsi}
            placeholder="Tulis isi atau ringkasan berita di sini..." />
        </div>
        <UploadArea id="beritaGambar" onFile={handleFile} preview={preview} label="Pilih gambar berita (opsional)" />
      </AdminModal>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// TAB PENGUMUMAN
// ════════════════════════════════════════════════════════════
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
    setIsi({ target: { value: item.isi || "" } });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!judul.trim()) return;
    setSubmitting(true);
    const cb = () => { setModalOpen(false); setSubmitting(false); };
    if (editItem) dispatch(asyncPutPengumuman(editItem.id, judul, isi, cb));
    else          dispatch(asyncPostPengumuman(judul, isi, cb));
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
        subtitle="Kelola pengumuman resmi sekolah"
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
              <td><strong>{item.judul}</strong></td>
              <td className="smk-admin-td-truncate" style={{ maxWidth: 320, fontSize: 13, color: "#6b7280" }}>
                {item.isi?.slice(0, 100)}
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
          <input className="smk-form-input" type="text" value={judul} onChange={setJudul}
            placeholder="contoh: Informasi PPDB Tahun Ajaran 2026/2027" />
        </div>
        <div className="smk-form-group">
          <label>Isi Pengumuman</label>
          <textarea className="smk-form-input" rows={5} value={isi} onChange={setIsi}
            placeholder="Tulis isi pengumuman secara lengkap..." />
        </div>
      </AdminModal>
    </>
  );
}

// ════════════════════════════════════════════════════════════
// TAB AGENDA
// ════════════════════════════════════════════════════════════
function AgendaTab({ data, loading, dispatch }) {
  const [modalOpen, setModalOpen]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [judul, setJudul]           = useInput("");
  const [tanggal, setTanggal]       = useInput("");
  const [lokasi, setLokasi]         = useInput("");

  const sorted = [...data].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  const openAdd = () => {
    setEditItem(null);
    setJudul({ target: { value: "" } });
    setTanggal({ target: { value: new Date().toISOString().slice(0, 10) } });
    setLokasi({ target: { value: "" } });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setJudul({ target: { value: item.judul } });
    setTanggal({ target: { value: item.tanggal?.slice(0, 10) || "" } });
    setLokasi({ target: { value: item.lokasi || "" } });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!judul.trim() || !tanggal) return;
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
          empty={!sorted.length}
        >
          {sorted.map((item) => {
            const d    = item.tanggal ? new Date(item.tanggal) : null;
            const tgl  = d ? String(d.getDate()).padStart(2, "0") : "—";
            const bln  = d ? d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase() : "—";
            const past = d && d < new Date();
            return (
              <tr key={item.id} style={{ opacity: past ? 0.6 : 1 }}>
                <td>
                  <div className="smk-admin-agenda-date-pill">
                    <span className="smk-admin-agenda-day">{tgl}</span>
                    <span className="smk-admin-agenda-mon">{bln}</span>
                  </div>
                </td>
                <td>
                  <strong>{item.judul}</strong>
                  {past && (
                    <span className="smk-admin-badge smk-admin-badge-silver" style={{ marginLeft: 8, fontSize: 10 }}>
                      Selesai
                    </span>
                  )}
                </td>
                <td style={{ fontSize: 13, color: "#6b7280" }}>
                  {item.lokasi ? `📍 ${item.lokasi}` : "—"}
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
          <input className="smk-form-input" type="text" value={judul} onChange={setJudul}
            placeholder="contoh: Rapat Wali Murid Kelas X" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="smk-form-group">
            <label>Tanggal <span style={{ color: "red" }}>*</span></label>
            <input className="smk-form-input" type="date" value={tanggal} onChange={setTanggal} />
          </div>
          <div className="smk-form-group">
            <label>Lokasi / Keterangan</label>
            <input className="smk-form-input" type="text" value={lokasi} onChange={setLokasi}
              placeholder="contoh: Aula SMK, 08.00 WIB" />
          </div>
        </div>
      </AdminModal>
    </>
  );
}
