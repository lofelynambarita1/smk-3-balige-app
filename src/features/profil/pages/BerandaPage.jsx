import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ProfilLayout from "../layouts/ProfilLayout";
import foto from "../../../assets/images/foto.png";
import {
  asyncLoadAllProfilData,
  asyncGetPrestasi,
  asyncGetProgramKeahlian,
  asyncGetMitraKerjasama,
} from "../states/action";

// ── Ubah path file upload backend jadi URL lengkap ──
function toImgUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:3000/${path.replace(/\\/g, "/")}`;
}

// ── Hook: detect kapan elemen masuk viewport ──
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
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, isVisible];
}

// ── Komponen wrapper animasi ──
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
    "fade-up": { opacity: 0, transform: "translateY(40px)" },
    "fade-left": { opacity: 0, transform: "translateX(-40px)" },
    "fade-right": { opacity: 0, transform: "translateX(40px)" },
    "fade-in": { opacity: 0, transform: "none" },
    "zoom-in": { opacity: 0, transform: "scale(0.92)" },
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
        ...(isVisible
          ? visibleStyle
          : (hiddenStyles[animation] ?? hiddenStyles["fade-up"])),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Data statis ──
const highlights = [
  { icon: "🎓", number: "1.200+", label: "Siswa Aktif" },
  { icon: "👨‍🏫", number: "85+", label: "Tenaga Pengajar" },
  { icon: "📈", number: "98%", label: "Tingkat Kelulusan" },
  { icon: "🏆", number: "45+", label: "Prestasi Tahun Ini" },
];

const beritaStatis = [
  {
    tag: "Kabar Sekolah",
    tagColor: "#5A82F2",
    title: "Pelaksanaan Ujian Tengah Semester Genap Tahun Ajaran 2025/2026",
    date: "11 Januari 2025",
    desc: "Uke-a olimpiade asia sekolah berhasil meraih juara 1 loh.",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
  },
  {
    tag: "Pengumuman",
    tagColor: "#F4C430",
    title: "Penerimaan Siswa Baru (PPDB) Jalur Prestasi telah dibuka",
    date: "12 Januari 2025",
    desc: "Acara tahunan festival seni dan budaya menampilkan.",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
  },
  {
    tag: "Agenda",
    tagColor: "#27ae60",
    title: "Rapat Koordinasi Industri (DU/DI) – 12 Maret 2026",
    date: "11 Januari 2025",
    desc: "Manajemen melaksanakan laboratorium komputer baru dan.",
    img: "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=400&q=80",
  },
];

// ─────────────────────────────────────────────
export default function BerandaPage() {
  const dispatch = useDispatch();

  const visiMisi = useSelector((s) => s.visiMisi);
  const sejarahIdentitas = useSelector((s) => s.sejarahIdentitas);
  const programKeahlian = useSelector((s) => s.programKeahlian);
  const mitraKerjasama = useSelector((s) => s.mitraKerjasama);

  useEffect(() => {
    dispatch(asyncLoadAllProfilData());
    dispatch(asyncGetPrestasi());
    dispatch(asyncGetProgramKeahlian());
    dispatch(asyncGetMitraKerjasama());
  }, [dispatch]);

  const visi = visiMisi.find((item) => item.tipe === "visi");
  const misiList = visiMisi.filter((item) => item.tipe === "misi");
  const sejarah = sejarahIdentitas[0] || null;
  const jurusanPreview = programKeahlian.slice(0, 3);

  return (
    <ProfilLayout>
      {/* ── HERO ── */}
      <section className="smk-beranda-hero">
        <div className="smk-beranda-hero-inner">
          <Animate
            animation="fade-left"
            delay={0}
            threshold={0.1}
            className="smk-beranda-hero-text"
          >
            <span className="smk-badge">Tahun Ajaran 2024/2025</span>
            <h1>
              Selamat Datang di
              <br />
              <span className="smk-hero-highlight">SMK Negeri 3 Balige</span>
            </h1>
            <p>
              Sekolah vokasi terbaik yang berkomitmen mencetak generasi unggul,
              berkarakter, dan siap menghadapi dunia industri global.
            </p>
            <div className="smk-beranda-cta">
            </div>
          </Animate>

          <Animate
            animation="fade-right"
            delay={150}
            threshold={0.1}
            className="smk-beranda-hero-img"
          >
            <img src={foto} alt="SMK Negeri 3 Balige" />
          </Animate>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="smk-beranda-stats">
        <div className="smk-container">
          <div className="smk-stats-grid">
            {highlights.map((item, idx) => (
              <Animate key={idx} animation="fade-up" delay={idx * 100}>
                <div className="smk-stat-card">
                  <span className="smk-stat-icon">{item.icon}</span>
                  <strong className="smk-stat-number">{item.number}</strong>
                  <span className="smk-stat-label">{item.label}</span>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFIL & VISI MISI ── */}
      <section className="smk-section smk-bg-cream">
        <div className="smk-container">
          <Animate animation="fade-up">
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <span className="smk-badge smk-badge-outline">
                Profil Sekolah
              </span>
            </div>
            <h2
              className="smk-section-title smk-title-center"
              style={{ marginBottom: "6px" }}
            >
              Profil &amp; Visi Misi
            </h2>
            <p
              className="smk-section-subtitle"
              style={{ textAlign: "center", marginBottom: "40px" }}
            >
              Lembaga pendidikan terkemuka yang berkomitmen menghasilkan lulusan
              berkualitas
            </p>
          </Animate>

          <div
            style={{
              display: "flex",
              gap: "48px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Kiri: foto sekolah */}
            <Animate
              animation="fade-left"
              delay={100}
              style={{ flex: "1", minWidth: "280px" }}
            >
              <img
                src={foto}
                alt="SMK Negeri 3 Balige"
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  objectFit: "cover",
                  height: "320px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              />
            </Animate>

            {/* Kanan: Visi & Misi */}
            <Animate
              animation="fade-right"
              delay={150}
              style={{ flex: "1.2", minWidth: "280px" }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "28px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  border: "1.5px solid #dbe3ff",
                }}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#1f2c5c",
                    marginBottom: "20px",
                  }}
                >
                  Visi &amp; Misi
                </h3>

                {/* Visi */}
                <div
                  style={{
                    background: "#f0f4ff",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "16px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#5a82f2",
                      marginBottom: "6px",
                    }}
                  >
                    Visi
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#444",
                      lineHeight: "1.7",
                    }}
                  >
                    {visi ? visi.deskripsi : "Belum ada data visi."}
                  </p>
                </div>

                {/* Misi */}
                <div
                  style={{
                    background: "#f0f4ff",
                    borderRadius: "12px",
                    padding: "16px 20px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#5a82f2",
                      marginBottom: "8px",
                    }}
                  >
                    Misi
                  </p>
                  {misiList.length > 0 ? (
                    <ul
                      style={{ paddingLeft: "0", listStyle: "none", margin: 0 }}
                    >
                      {misiList.map((item) => (
                        <li
                          key={item.id}
                          style={{
                            fontSize: "18px",
                            color: "#444",
                            lineHeight: "1.7",
                            paddingLeft: "20px",
                            position: "relative",
                            marginBottom: "4px",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              color: "#5a82f2",
                              fontWeight: "700",
                            }}
                          >
                            ✓
                          </span>
                          {item.deskripsi}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: "#aaa", fontSize: "18px" }}>
                      Belum ada data misi.
                    </p>
                  )}
                </div>
              </div>
            </Animate>
          </div>

          {/* Tentang Sekolah */}
          {sejarah && (
            <Animate
              animation="fade-up"
              delay={100}
              style={{ marginTop: "40px" }}
            >
              <h3
                style={{
                  fontSize: "23px",
                  fontWeight: "700",
                  color: "#5a82f2",
                  marginBottom: "12px",
                }}
              >
                Tentang Sekolah
              </h3>
              <p
                style={{
                  fontSize: "18px",
                  color: "#555",
                  fontStyle: "italic",
                  borderLeft: "3px solid #5a82f2",
                  paddingLeft: "16px",
                  lineHeight: "1.8",
                }}
              >
                "{sejarah.deskripsi}"
              </p>
            </Animate>
          )}
        </div>
      </section>

      {/* ── PROGRAM KEAHLIAN ── */}
      <section className="smk-section">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <span className="smk-badge smk-badge-outline">
              Program Keahlian
            </span>
            <h2
              className="smk-section-title smk-title-center"
              style={{ marginTop: "12px" }}
            >
              Jurusan Di SMK Negeri 3 Balige
            </h2>
            <p className="smk-section-subtitle">
              Pilihan program keahlian di SMK Negeri 3 Balige.
            </p>
          </Animate>

          <div className="smk-jurusan-grid">
            {jurusanPreview.length > 0 ? (
              jurusanPreview.map((item, idx) => (
                <Animate key={item.id} animation="fade-up" delay={idx * 100}>
                  <div className="smk-jurusan-card">
                    <div
                      className="smk-jurusan-icon"
                      style={{ background: "#5A82F2" }}
                    >
                      <span>{item.icon || "🎓"}</span>
                    </div>
                    <h3 className="smk-jurusan-title">{item.nama_jurusan}</h3>
                    <p className="smk-jurusan-desc">{item.deskripsi}</p>
                  </div>
                </Animate>
              ))
            ) : (
              <>
                {[
                  {
                    icon: "💻",
                    bg: "#5A82F2",
                    title: "Teknik Komputer & Jaringan",
                    desc: "Fokus pada infrastruktur jaringan dan keamanan siber.",
                  },
                  {
                    icon: "🎨",
                    bg: "#5A82F2",
                    title: "Multimedia",
                    desc: "Pengembangan kreatif di bidang desain dan produksi media.",
                  },
                  {
                    icon: "📊",
                    bg: "#5A82F2",
                    title: "Akuntansi",
                    desc: "Manajemen keuangan dan pelaporan akuntansi modern.",
                  },
                ].map((item, idx) => (
                  <Animate key={idx} animation="fade-up" delay={idx * 100}>
                    <div className="smk-jurusan-card">
                      <div
                        className="smk-jurusan-icon"
                        style={{ background: item.bg }}
                      >
                        {item.icon}
                      </div>
                      <h3 className="smk-jurusan-title">{item.title}</h3>
                      <p className="smk-jurusan-desc">{item.desc}</p>
                    </div>
                  </Animate>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── BERITA TERBARU ── */}
      <section className="smk-section smk-bg-cream">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <span className="smk-badge smk-badge-outline">
              Pengumuman Penting
            </span>
            <h2
              className="smk-section-title smk-title-center"
              style={{ marginTop: "12px" }}
            >
              Berita Terbaru &amp; Pengumuman
            </h2>
          </Animate>

          <div className="smk-berita-grid" style={{ marginTop: "32px" }}>
            {beritaStatis.map((item, idx) => (
              <Animate key={idx} animation="fade-up" delay={idx * 120}>
                <div className="smk-berita-card">
                  <div className="smk-berita-img">
                    <img src={item.img} alt={item.title} />
                    <span
                      className="smk-berita-tag"
                      style={{ background: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div className="smk-berita-body">
                    <div className="smk-berita-meta">
                      <span>📅</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="smk-berita-title">{item.title}</h3>
                    <p className="smk-berita-desc">{item.desc}</p>
                    <NavLink to="/berita" className="smk-berita-link">
                      Baca Selengkapnya →
                    </NavLink>
                  </div>
                </div>
              </Animate>
            ))}
          </div>
        </div>
      </section>

      {/* ── MITRA KERJASAMA ── */}
      <section className="smk-section">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <span className="smk-badge smk-badge-outline">Mitra Kerjasama</span>
            <h2
              className="smk-section-title smk-title-center"
              style={{ marginTop: "12px" }}
            >
              Mitra Kerjasama
            </h2>
          </Animate>

          <div className="smk-mitra-grid" style={{ marginTop: "32px" }}>
            {mitraKerjasama.length > 0 ? (
              mitraKerjasama.map((item, idx) => (
                <Animate key={item.id} animation="zoom-in" delay={idx * 80}>
                  <div className="smk-mitra-card">
                    {item.logo ? (
                      <img
                        src={toImgUrl(item.logo)}
                        alt={item.nama_mitra}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="smk-mitra-logo">🤝</span>
                    )}
                    <span className="smk-mitra-name">{item.nama_mitra}</span>
                  </div>
                </Animate>
              ))
            ) : (
              <p style={{ color: "#aaa" }}>Belum ada data mitra kerjasama.</p>
            )}
          </div>
        </div>
      </section>
    </ProfilLayout>
  );
}
