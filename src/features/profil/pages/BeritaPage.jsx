// src/features/profil/pages/BeritaPage.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfilLayout from "../layouts/ProfilLayout";
import { asyncLoadAllBeritaData } from "../../berita/states/action";
import { BASE_URL } from "../../../helpers/apiHelper";

// ── Convert backend file path → full URL ─────────────────────────────────────
function mediaUrl(filePath) {
  if (!filePath) return null;
  if (filePath.startsWith("http")) return filePath;
  const base = BASE_URL.replace("/api", ""); // http://localhost:3000
  return `${base}/${filePath.replace(/\\/g, "/").replace(/^\//, "")}`;
}

// ── Format date string → Indonesian readable ─────────────────────────────────
function formatTgl(str) {
  if (!str) return "";
  try {
    return new Date(str).toLocaleDateString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return str; }
}

// ── Intersection-observer animation hook ─────────────────────────────────────
function useInView(threshold = 0.12, once = true) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); if (once) obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);
  return [ref, visible];
}

function Animate({ children, animation = "fade-up", delay = 0, threshold = 0.12, style = {}, className = "" }) {
  const [ref, visible] = useInView(threshold);
  const hidden = {
    "fade-up":    { opacity: 0, transform: "translateY(36px)" },
    "fade-left":  { opacity: 0, transform: "translateX(-36px)" },
    "fade-right": { opacity: 0, transform: "translateX(36px)" },
    "fade-in":    { opacity: 0 },
    "zoom-in":    { opacity: 0, transform: "scale(0.93)" },
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        willChange: "opacity, transform",
        ...(visible
          ? { opacity: 1, transform: "translateY(0) translateX(0) scale(1)" }
          : (hidden[animation] ?? hidden["fade-up"])),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────────────────────
const S = {
  // hero
  hero:        { background: "#0f1f4b", padding: "60px 40px 52px", color: "#fff" },
  heroInner:   { maxWidth: 1200, margin: "0 auto" },
  badge:       { display: "inline-block", background: "#f4c430", color: "#0f1f4b", fontSize: 12, fontWeight: 700, padding: "5px 16px", borderRadius: 20, marginBottom: 18 },
  h1:          { color: "#fff", fontSize: 40, fontWeight: 900, lineHeight: 1.12, marginBottom: 12 },
  heroDesc:    { color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 },
  searchRow:   { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  searchBox:   { display: "flex", alignItems: "center", background: "#fff", borderRadius: 8, padding: "10px 16px", gap: 8, flex: "1 1 260px", maxWidth: 360 },
  searchInput: { border: "none", outline: "none", fontSize: 14, color: "#1f2937", width: "100%", background: "transparent", fontFamily: "Poppins, sans-serif" },
  // section
  secCream: { background: "#f5f7fa", padding: "52px 40px" },
  secWhite: { background: "#fff",    padding: "52px 40px" },
  wrap:     { maxWidth: 1280, margin: "0 auto" },
  grid2col: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 36, alignItems: "start" },
  secTitle: { fontSize: 19, fontWeight: 800, color: "#1f2937", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 },
  bar:      { display: "inline-block", width: 4, height: 22, background: "#f4c430", borderRadius: 2, flexShrink: 0 },
  // berita utama
  utamaCard:    { background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #e5e9f2" },
  utamaImgWrap: { width: "100%", height: 220, overflow: "hidden", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" },
  utamaImg:     { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  utamaBody:    { padding: "22px 26px", display: "flex", flexDirection: "column", gap: 10 },
  utamaDate:    { fontSize: 12, color: "#9ca3af" },
  utamaTitle:   { fontSize: 17, fontWeight: 800, color: "#0f1f4b", lineHeight: 1.45, margin: 0 },
  utamaDesc:    { fontSize: 14, color: "#4b5563", lineHeight: 1.7, margin: 0 },
  btnBaca:      { background: "#0f1f4b", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "fit-content", fontFamily: "Poppins, sans-serif" },
  // agenda
  agendaList:   { background: "#fff", borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #e5e9f2", overflow: "hidden" },
  agendaItem:   { display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderBottom: "1px solid #f0f3f8" },
  agendaDate:   { background: "#0f1f4b", color: "#fff", borderRadius: 8, width: 48, minWidth: 48, height: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  agendaDay:    { fontSize: 17, fontWeight: 900, lineHeight: 1 },
  agendaMon:    { fontSize: 9,  fontWeight: 700, letterSpacing: 0.5, color: "#f4c430" },
  agendaTitle:  { fontSize: 13, fontWeight: 700, color: "#1f2937", lineHeight: 1.4 },
  agendaLoc:    { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  // berita terbaru grid
  beritaGrid:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 4 },
  beritaCard:    { background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #e5e9f2", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "pointer" },
  beritaImgWrap: { height: 185, overflow: "hidden", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" },
  beritaImg:     { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  beritaBody:    { padding: "18px 20px" },
  beritaMeta:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  beritaDate:    { fontSize: 11, color: "#9ca3af" },
  beritaTitle:   { fontSize: 14, fontWeight: 800, color: "#1f2937", marginBottom: 6, lineHeight: 1.45 },
  beritaDesc:    { fontSize: 13, color: "#6b7280", lineHeight: 1.6 },
  // pengumuman
  pengGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 4 },
  pengCard:  { background: "#fff", border: "1.5px solid #e5e9f2", borderRadius: 14, padding: "26px 24px", display: "flex", flexDirection: "column", gap: 10 },
  pengIcon:  { width: 44, height: 44, background: "#0f1f4b", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  pengTitle: { fontSize: 15, fontWeight: 800, color: "#0f1f4b", lineHeight: 1.4, margin: 0 },
  pengText:  { fontSize: 13, color: "#6b7280", lineHeight: 1.65, flex: 1, margin: 0 },
  btnLihat:  { background: "#f3f4f6", border: "1px solid #e5e7eb", color: "#4b5563", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", width: "fit-content", fontFamily: "Poppins, sans-serif" },
  // misc
  emptyBox:   { gridColumn: "1 / -1", textAlign: "center", color: "#9ca3af", padding: "48px 20px", fontSize: 14 },
  loadingBox: { textAlign: "center", color: "#9ca3af", padding: "40px", fontSize: 14 },
};

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function BeritaPage() {
  const dispatch = useDispatch();

  // Read from Redux store (populated by asyncLoadAllBeritaData)
  const beritaList = useSelector((s) => s.berita     || []);
  const agendaList = useSelector((s) => s.agenda     || []);
  const pengList   = useSelector((s) => s.pengumuman || []);
  const loading    = useSelector((s) => s.beritaLoading || false);

  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(asyncLoadAllBeritaData()); }, [dispatch]);

  // ── Sort berita: newest first ────────────────────────────────────────────
  const sortedBerita = [...beritaList].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  // Berita utama = the single newest item
  const beritaUtama = sortedBerita[0] || null;

  // The rest filtered by search
  const q = search.toLowerCase();
  const filteredRest = sortedBerita.slice(1).filter((b) =>
    (b.title || "").toLowerCase().includes(q) ||
    (b.description || "").toLowerCase().includes(q) ||
    (b.excerpt || "").toLowerCase().includes(q)
  );

  // Also filter utama
  const utamaVisible = !search || (
    beritaUtama && (
      (beritaUtama.title || "").toLowerCase().includes(q) ||
      (beritaUtama.description || "").toLowerCase().includes(q)
    )
  );

  // ── Sort agenda: soonest first ────────────────────────────────────────────
  const sortedAgenda = [...agendaList].sort(
    (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
  );

  return (
    <ProfilLayout>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <Animate animation="fade-up" delay={0} threshold={0.05}>
            <span style={S.badge}>Tahun Ajaran 2026/2027</span>
          </Animate>
          <Animate animation="fade-up" delay={110} threshold={0.05}>
            <h1 style={S.h1}>BERITA &amp; INFORMASI<br />SEKOLAH</h1>
          </Animate>
          <Animate animation="fade-up" delay={200} threshold={0.05}>
            <p style={S.heroDesc}>
              Temukan informasi terkini seputar kegiatan, prestasi,<br />
              dan pengumuman resmi dari SMK Negeri 3 Balige.
            </p>
          </Animate>
          <Animate animation="fade-up" delay={290} threshold={0.05}>
            <div style={S.searchRow}>
              <div style={S.searchBox}>
                <span style={{ color: "#9ca3af", display: "flex" }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </span>
                <input
                  style={S.searchInput}
                  placeholder="Cari judul berita..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}
                  >
                    ✕
                  </button>
                )}
              </div>
              {search && (
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                  {filteredRest.length + (utamaVisible && beritaUtama ? 1 : 0)} hasil
                </span>
              )}
            </div>
          </Animate>
        </div>
      </section>

      {/* ══ BERITA UTAMA + AGENDA ═════════════════════════════════════════════ */}
      <section style={S.secCream}>
        <div style={{ ...S.wrap, ...S.grid2col }}>

          {/* Berita Utama */}
          <div>
            <Animate animation="fade-up">
              <h2 style={S.secTitle}><span style={S.bar}/>Berita Utama</h2>
            </Animate>

            {loading ? (
              <div style={S.loadingBox}>⏳ Memuat berita...</div>
            ) : beritaUtama && utamaVisible ? (
              <Animate animation="fade-left" delay={100}>
                <div style={S.utamaCard}>
                  <div style={S.utamaImgWrap}>
                    {beritaUtama.imageUrl ? (
                      <img
                        src={mediaUrl(beritaUtama.imageUrl)}
                        alt={beritaUtama.title}
                        style={S.utamaImg}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span style={{ fontSize: 52, opacity: 0.3 }}>📰</span>
                    )}
                  </div>
                  <div style={S.utamaBody}>
                    <span style={S.utamaDate}>📅 {formatTgl(beritaUtama.createdAt)}</span>
                    <h3 style={S.utamaTitle}>{beritaUtama.title}</h3>
                    <p style={S.utamaDesc}>
                      {(
                        beritaUtama.description ||
                        beritaUtama.excerpt ||
                        beritaUtama.content ||
                        ""
                      ).slice(0, 200)}
                    </p>
                    <button style={S.btnBaca}>Baca Selengkapnya</button>
                  </div>
                </div>
              </Animate>
            ) : (
              <div style={{ ...S.utamaCard, padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>
                {search ? "Tidak ditemukan." : "Belum ada berita."}
              </div>
            )}
          </div>

          {/* Agenda Sekolah */}
          <div>
            <Animate animation="fade-up">
              <h2 style={S.secTitle}><span style={S.bar}/>Agenda Sekolah</h2>
            </Animate>
            <div style={S.agendaList}>
              {sortedAgenda.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                  Belum ada agenda.
                </div>
              ) : (
                sortedAgenda.slice(0, 6).map((a, i) => {
                  const d   = a.date ? new Date(a.date) : null;
                  const tgl = d ? String(d.getDate()).padStart(2, "0") : "—";
                  const bln = d
                    ? d.toLocaleDateString("id-ID", { month: "short" }).toUpperCase()
                    : "—";
                  return (
                    <Animate key={a.id || i} animation="fade-right" delay={i * 80}>
                      <div style={S.agendaItem}>
                        <div style={S.agendaDate}>
                          <span style={S.agendaDay}>{tgl}</span>
                          <span style={S.agendaMon}>{bln}</span>
                        </div>
                        <div>
                          <div style={S.agendaTitle}>{a.title}</div>
                          {a.location && (
                            <div style={S.agendaLoc}>📍 {a.location}</div>
                          )}
                        </div>
                      </div>
                    </Animate>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ══ BERITA TERBARU ════════════════════════════════════════════════════ */}
      <section style={S.secWhite}>
        <div style={S.wrap}>
          <Animate animation="fade-up">
            <h2 style={S.secTitle}>
              <span style={S.bar}/>
              {search ? `Hasil Pencarian "${search}"` : "Berita Terbaru"}
              {!loading && (
                <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af", marginLeft: 8 }}>
                  ({filteredRest.length} berita)
                </span>
              )}
            </h2>
          </Animate>

          {loading ? (
            <div style={S.loadingBox}>⏳ Memuat berita...</div>
          ) : filteredRest.length === 0 ? (
            <div style={S.emptyBox}>
              {search
                ? `Tidak ada berita dengan kata kunci "${search}".`
                : "Belum ada berita lain selain berita utama."}
            </div>
          ) : (
            <div style={S.beritaGrid}>
              {filteredRest.map((b, idx) => (
                <Animate key={b.id} animation="fade-up" delay={idx * 100}>
                  <div style={S.beritaCard}>
                    <div style={S.beritaImgWrap}>
                      {b.imageUrl ? (
                        <img
                          src={mediaUrl(b.imageUrl)}
                          alt={b.title}
                          style={S.beritaImg}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <span style={{ fontSize: 40, opacity: 0.25 }}>📰</span>
                      )}
                    </div>
                    <div style={S.beritaBody}>
                      <div style={S.beritaMeta}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>
                          BERITA
                        </span>
                        <span style={S.beritaDate}>📅 {formatTgl(b.createdAt)}</span>
                      </div>
                      <h3 style={S.beritaTitle}>{b.title}</h3>
                      <p style={S.beritaDesc}>
                        {(b.description || b.excerpt || b.content || "").slice(0, 115)}
                        {(b.description || b.excerpt || b.content || "").length > 115 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                </Animate>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ PENGUMUMAN ════════════════════════════════════════════════════════ */}
      <section style={S.secCream}>
        <div style={S.wrap}>
          <Animate animation="fade-up">
            <h2 style={S.secTitle}><span style={S.bar}/>Pengumuman</h2>
          </Animate>

          {loading ? (
            <div style={S.loadingBox}>⏳ Memuat pengumuman...</div>
          ) : pengList.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px", fontSize: 14 }}>
              Belum ada pengumuman.
            </div>
          ) : (
            <div style={S.pengGrid}>
              {pengList.map((p, idx) => (
                <Animate key={p.id || idx} animation="fade-up" delay={idx * 100}>
                  <div style={S.pengCard}>
                    <div style={S.pengIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                    </div>
                    <h3 style={S.pengTitle}>{p.title}</h3>
                    <p style={S.pengText}>
                      {(p.content || p.description || "").slice(0, 160)}
                      {(p.content || p.description || "").length > 160 ? "..." : ""}
                    </p>
                    <button style={S.btnLihat}>Lihat Selengkapnya</button>
                  </div>
                </Animate>
              ))}
            </div>
          )}
        </div>
      </section>

    </ProfilLayout>
  );
}
