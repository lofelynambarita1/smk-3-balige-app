import { useState, useEffect, useRef } from "react";
import ProfilLayout from "../layouts/ProfilLayout";

// ══════════════════════════════════════════════
// HOOK: deteksi elemen masuk viewport
// (sama persis seperti di BerandaPage & ProfilPage)
// ══════════════════════════════════════════════
function useInView(threshold = 0.15, once = true) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isVisible];
}

// ══════════════════════════════════════════════
// KOMPONEN ANIMASI
// (sama persis seperti di BerandaPage & ProfilPage)
// ══════════════════════════════════════════════
function Animate({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.15,
  style = {},
  className = "",
}) {
  const [ref, isVisible] = useInView(threshold);

  const hiddenStyles = {
    "fade-up":    { opacity: 0, transform: "translateY(40px)" },
    "fade-left":  { opacity: 0, transform: "translateX(-40px)" },
    "fade-right": { opacity: 0, transform: "translateX(40px)" },
    "fade-in":    { opacity: 0, transform: "none" },
    "zoom-in":    { opacity: 0, transform: "scale(0.92)" },
  };

  const visibleStyle = {
    opacity: 1,
    transform: "translateY(0) translateX(0) scale(1)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        willChange: "opacity, transform",
        ...(isVisible ? visibleStyle : (hiddenStyles[animation] ?? hiddenStyles["fade-up"])),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════
// DATA STATIS
// ══════════════════════════════════════════════
const agendaData = [
  { tanggal: "22", bulan: "FEB", judul: "Rapat Wali Murid Kelas X",              lokasi: "Aula SMK N 3 Balige, 08.00 WIB" },
  { tanggal: "01", bulan: "MAR", judul: "Hari Pertama Belajar Semester Genap",   lokasi: "Seluruh Kelas" },
  { tanggal: "15", bulan: "MAR", judul: "Ujian Tengah Semester Genap",           lokasi: "Kelas X, XI & XII" },
  { tanggal: "20", bulan: "MAR", judul: "LKS Tingkat Provinsi Sumatera Utara",  lokasi: "Medan, Sumatera Utara" },
];

const beritaUtama = {
  tanggal: "15 Februari 2025",
  judul: "SMK N 3 Balige Raih Akreditasi A dari BAN-SM Tahun 2024",
  ringkasan:
    "Setelah melalui proses penilaian panjang dan ketat, SMK Negeri 3 Balige berhasil meraih predikat Akreditasi A dari Badan Akreditasi Nasional Sekolah/Madrasah pada tahun ajaran 2024.",
  gambar: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
};

const beritaTerbaru = [
  { id: 1, kategori: "AKADEMIK", tanggal: "13 Maret 2025", judul: "Jadwal Ujian Akhir Semester Genap 2024/2025",         ringkasan: "Jadwal UAS telah diterbitkan, siswa diharapkan mempersiapkan diri dengan baik.",                                      gambar: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&q=80" },
  { id: 2, kategori: "PRESTASI", tanggal: "13 Maret 2025", judul: "Juara I Lomba Masak Tingkat Kabupaten",              ringkasan: "Siswa jurusan Multimedia berhasil membawa pulang medali emas di ajang Memasak Kabupaten Toba.",                       gambar: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80" },
  { id: 3, kategori: "KEGIATAN", tanggal: "13 Maret 2025", judul: "Pelaksanaan Praktik Kerja Lapangan Siswa Kelas XI", ringkasan: "Ratusan siswa kelas XI telah ditempatkan di 28 mitra industri untuk menjalani PKL semester ini.",                    gambar: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80" },
  { id: 4, kategori: "AKADEMIK", tanggal: "13 Maret 2025", judul: "Penandatanganan MoU dengan PT Sinom Pangkalan Susu", ringkasan: "SMK Negeri 3 Balige resmi menjalin kerja sama industri dengan PT Sinom Pangkalan Susu.",                           gambar: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80" },
];

const pengumumanData = [
  { id: 1, judul: "Informasi PPDB Tahun Ajaran 2026/2027",  isi: "Pendaftaran peserta didik baru akan dibuka mulai 1 Juni 2025 dengan 4 jalur pendaftaran." },
  { id: 2, judul: "Jadwal Ulangan Semester Ganjil",         isi: "UAS semester ganjil akan dilaksanakan tanggal 15-22 Desember 2026 untuk semua kelas." },
  { id: 3, judul: "Jadwal Ulangan Semester Ganjil",         isi: "UAS semester ganjil akan dilaksanakan tanggal 15-22 Desember 2026 untuk semua kelas." },
  { id: 4, judul: "Jadwal Ulangan Semester Ganjil",         isi: "UAS semester ganjil akan dilaksanakan tanggal 15-22 Desember 2026 untuk semua kelas." },
];

const KATEGORI_COLOR = {
  AKADEMIK:   "#F59E0B",
  PRESTASI:   "#10B981",
  KEGIATAN:   "#3B82F6",
  PENGUMUMAN: "#8B5CF6",
};

// ══════════════════════════════════════════════
// STYLES — inline supaya tidak perlu file CSS
// ══════════════════════════════════════════════
const S = {
  /* HERO */
  hero: {
    background: "#0f1f4b",
    padding: "60px 40px 52px",
    color: "#fff",
  },
  heroContent: { maxWidth: 1200, margin: "0 auto" },
  badge: {
    display: "inline-block",
    background: "#f4c430",
    color: "#0f1f4b",
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 16px",
    borderRadius: 20,
    marginBottom: 20,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.12,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  heroDesc: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 36,
  },
  searchRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 8,
    padding: "10px 16px",
    gap: 8,
    minWidth: 260,
    flex: 1,
    maxWidth: 340,
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 14,
    color: "#1f2937",
    width: "100%",
    background: "transparent",
    fontFamily: "Poppins, sans-serif",
  },

  /* SECTION */
  sectionCream: { background: "#f5f7fa", padding: "52px 40px" },
  sectionWhite: { background: "#fff", padding: "52px 40px" },
  container: { maxWidth: 1280, margin: "0 auto" },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 36,
    alignItems: "start",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#1f2937",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  titleBar: {
    display: "inline-block",
    width: 4,
    height: 22,
    background: "#f4c430",
    borderRadius: 2,
    flexShrink: 0,
  },

  /* BERITA UTAMA */
  utamaCard: {
    background: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    border: "1px solid #e5e9f2",
  },
  utamaImgWrap: { width: "100%", height: 220, overflow: "hidden" },
  utamaImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  utamaBody: { padding: "24px 26px", display: "flex", flexDirection: "column", gap: 10 },
  utamaDate: { fontSize: 12, color: "#9ca3af" },
  utamaJudul: { fontSize: 17, fontWeight: 800, color: "#0f1f4b", lineHeight: 1.45, margin: 0 },
  utamaRing: { fontSize: 14, color: "#4b5563", lineHeight: 1.7, margin: 0 },
  btnBaca: {
    background: "#0f1f4b",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    width: "fit-content",
    marginTop: 4,
    fontFamily: "Poppins, sans-serif",
  },

  /* AGENDA */
  agendaList: {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    border: "1px solid #e5e9f2",
    overflow: "hidden",
  },
  agendaItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 18px",
    borderBottom: "1px solid #f0f3f8",
  },
  agendaDate: {
    background: "#0f1f4b",
    color: "#fff",
    borderRadius: 8,
    width: 50,
    minWidth: 50,
    height: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  agendaDay: { fontSize: 18, fontWeight: 900, lineHeight: 1 },
  agendaMon: { fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: "#f4c430" },
  agendaJudul: { fontSize: 13, fontWeight: 700, color: "#1f2937", lineHeight: 1.4 },
  agendaLokasi: { fontSize: 12, color: "#9ca3af", marginTop: 3 },
  agendaSemua: {
    padding: "12px 18px",
    textAlign: "right",
    color: "#f4c430",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },

  /* BERITA TERBARU */
  beritaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
    marginTop: 4,
  },
  beritaCard: {
    background: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid #e5e9f2",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    cursor: "pointer",
  },
  beritaImgWrap: { height: 190, overflow: "hidden" },
  beritaImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  beritaBody: { padding: "20px 22px" },
  beritaMeta: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  beritaKat: { fontSize: 12, fontWeight: 700 },
  beritaDate: { fontSize: 12, color: "#9ca3af" },
  beritaJudul: { fontSize: 15, fontWeight: 800, color: "#1f2937", marginBottom: 8, lineHeight: 1.45 },
  beritaRing: { fontSize: 13, color: "#6b7280", lineHeight: 1.65 },

  /* PENGUMUMAN */
  pengGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginTop: 4,
  },
  pengCard: {
    background: "#fff",
    border: "1.5px solid #e5e9f2",
    borderRadius: 14,
    padding: "28px 26px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    cursor: "pointer",
  },
  pengIcon: {
    width: 46,
    height: 46,
    background: "#0f1f4b",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pengJudul: { fontSize: 15, fontWeight: 800, color: "#0f1f4b", lineHeight: 1.4, margin: 0 },
  pengIsi: { fontSize: 13, color: "#6b7280", lineHeight: 1.65, flex: 1, margin: 0 },
  btnLihat: {
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    color: "#4b5563",
    padding: "9px 18px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    width: "fit-content",
    fontFamily: "Poppins, sans-serif",
  },
};

// ══════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════
export default function BeritaPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch]             = useState("");

  const filters = ["Semua", "Berita", "Pengumuman", "Prestasi"];

  const filteredBerita = beritaTerbaru.filter((b) => {
    const matchFilter =
      activeFilter === "Semua" ||
      (activeFilter === "Berita"      && (b.kategori === "AKADEMIK" || b.kategori === "KEGIATAN")) ||
      (activeFilter === "Prestasi"    && b.kategori === "PRESTASI") ||
      (activeFilter === "Pengumuman"  && b.kategori === "PENGUMUMAN");
    const matchSearch =
      search === "" ||
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.ringkasan.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  /* filter btn style helper */
  const filterStyle = (f) => ({
    padding: "10px 22px",
    borderRadius: 8,
    border: activeFilter === f ? "none" : "1.5px solid rgba(255,255,255,0.2)",
    background: activeFilter === f ? "#f4c430" : "transparent",
    color: activeFilter === f ? "#0f1f4b" : "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontWeight: activeFilter === f ? 700 : 500,
    cursor: "pointer",
    fontFamily: "Poppins, sans-serif",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  });

  return (
    <ProfilLayout>

      {/* ══ HERO ══ */}
      <section style={S.hero}>
        <div style={S.heroContent}>

          <Animate animation="fade-up" delay={0} threshold={0.05}>
            <span style={S.badge}>Tahun Ajaran 2026/2027</span>
          </Animate>

          <Animate animation="fade-up" delay={120} threshold={0.05}>
            <h1 style={S.heroTitle}>
              BERITA &amp; INFORMASI<br />SEKOLAH
            </h1>
          </Animate>

          <Animate animation="fade-up" delay={220} threshold={0.05}>
            <p style={S.heroDesc}>
              Temukan informasi terkini seputar kegiatan, prestasi,<br />
              dan pengumuman resmi dari SMK Negeri 3 Balige.
            </p>
          </Animate>

          <Animate animation="fade-up" delay={320} threshold={0.05}>
            <div style={S.searchRow}>
              <div style={S.searchWrap}>
                <span style={{ color: "#9ca3af", display: "flex", alignItems: "center" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </span>
                <input
                  style={S.searchInput}
                  placeholder="Cari berita atau pengumuman..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {filters.map((f) => (
                <button key={f} style={filterStyle(f)} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </Animate>

        </div>
      </section>

      {/* ══ BERITA UTAMA + AGENDA ══ */}
      <section style={S.sectionCream}>
        <div style={{ ...S.container, ...S.mainGrid }}>

          {/* Berita Utama */}
          <div>
            <Animate animation="fade-up" delay={0}>
              <h2 style={S.sectionTitle}>
                <span style={S.titleBar} />Berita Utama
              </h2>
            </Animate>
            <Animate animation="fade-left" delay={120}>
              <div style={S.utamaCard}>
                <div style={S.utamaImgWrap}>
                  <img src={beritaUtama.gambar} alt="berita utama" style={S.utamaImg} />
                </div>
                <div style={S.utamaBody}>
                  <span style={S.utamaDate}>📅 {beritaUtama.tanggal}</span>
                  <h3 style={S.utamaJudul}>{beritaUtama.judul}</h3>
                  <p style={S.utamaRing}>{beritaUtama.ringkasan}</p>
                  <button style={S.btnBaca}>Baca Selengkapnya</button>
                </div>
              </div>
            </Animate>
          </div>

          {/* Agenda */}
          <div>
            <Animate animation="fade-up" delay={0}>
              <h2 style={S.sectionTitle}>
                <span style={S.titleBar} />Agenda Sekolah
              </h2>
            </Animate>
            <div style={S.agendaList}>
              {agendaData.map((a, i) => (
                <Animate key={i} animation="fade-right" delay={i * 90}>
                  <div style={S.agendaItem}>
                    <div style={S.agendaDate}>
                      <span style={S.agendaDay}>{a.tanggal}</span>
                      <span style={S.agendaMon}>{a.bulan}</span>
                    </div>
                    <div>
                      <div style={S.agendaJudul}>{a.judul}</div>
                      <div style={S.agendaLokasi}>{a.lokasi}</div>
                    </div>
                  </div>
                </Animate>
              ))}
              <Animate animation="fade-up" delay={agendaData.length * 90}>
                <div style={S.agendaSemua}>Semua →</div>
              </Animate>
            </div>
          </div>

        </div>
      </section>

      {/* ══ BERITA TERBARU ══ */}
      <section style={S.sectionWhite}>
        <div style={S.container}>

          <Animate animation="fade-up" delay={0}>
            <h2 style={S.sectionTitle}>
              <span style={S.titleBar} />Berita Terbaru
            </h2>
          </Animate>

          <div style={S.beritaGrid}>
            {filteredBerita.length === 0 ? (
              <Animate animation="fade-in" delay={0}>
                <p style={{ color: "#9ca3af", textAlign: "center", padding: 40 }}>
                  Tidak ada berita yang ditemukan.
                </p>
              </Animate>
            ) : (
              filteredBerita.map((b, idx) => (
                <Animate key={b.id} animation="fade-up" delay={idx * 120}>
                  <div style={S.beritaCard}>
                    <div style={S.beritaImgWrap}>
                      <img src={b.gambar} alt={b.judul} style={S.beritaImg} />
                    </div>
                    <div style={S.beritaBody}>
                      <div style={S.beritaMeta}>
                        <span style={{ ...S.beritaKat, color: KATEGORI_COLOR[b.kategori] || "#F59E0B" }}>
                          {b.kategori}
                        </span>
                        <span style={S.beritaDate}>📅 {b.tanggal}</span>
                      </div>
                      <h3 style={S.beritaJudul}>{b.judul}</h3>
                      <p style={S.beritaRing}>{b.ringkasan}</p>
                    </div>
                  </div>
                </Animate>
              ))
            )}
          </div>

        </div>
      </section>

      {/* ══ PENGUMUMAN ══ */}
      <section style={S.sectionCream}>
        <div style={S.container}>

          <Animate animation="fade-up" delay={0}>
            <h2 style={S.sectionTitle}>
              <span style={S.titleBar} />Pengumuman
            </h2>
          </Animate>

          <div style={S.pengGrid}>
            {pengumumanData.map((p, idx) => (
              <Animate key={p.id} animation="fade-up" delay={idx * 110}>
                <div style={S.pengCard}>
                  <div style={S.pengIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                  </div>
                  <h3 style={S.pengJudul}>{p.judul}</h3>
                  <p style={S.pengIsi}>{p.isi}</p>
                  <button style={S.btnLihat}>Lihat Selengkapnya</button>
                </div>
              </Animate>
            ))}
          </div>

        </div>
      </section>

    </ProfilLayout>
  );
}
