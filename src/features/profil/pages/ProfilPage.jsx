import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfilLayout from "../layouts/ProfilLayout";
import foto from "../../../assets/images/foto.png";
import { asyncLoadAllProfilData } from "../states/action";

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
// animation: "fade-up" | "fade-left" | "fade-right" | "fade-in" | "zoom-in"
// delay: angka ms, misal 0 / 100 / 200
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

// ─────────────────────────────────────────────
export default function ProfilPage() {
  const dispatch = useDispatch();

  const sejarahIdentitas = useSelector((s) => s.sejarahIdentitas);
  const visiMisi = useSelector((s) => s.visiMisi);
  const strukturOrganisasi = useSelector((s) => s.strukturOrganisasi);
  const fasilitas = useSelector((s) => s.fasilitas);
  const prestasi = useSelector((s) => s.prestasi);
  const programKeahlian = useSelector((s) => s.programKeahlian);
  const mitraKerjasama = useSelector((s) => s.mitraKerjasama);
  const loading = useSelector((s) => s.profilLoading);

  useEffect(() => {
    dispatch(asyncLoadAllProfilData());
  }, [dispatch]);

  const visi = visiMisi.find((item) => item.tipe === "visi");
  const misiList = visiMisi.filter((item) => item.tipe === "misi");
  const sejarah = sejarahIdentitas[0] || null;

  return (
    <ProfilLayout>
      {/* ── HERO ── */}
      <section className="smk-hero">
        <div className="smk-hero-content">
          <Animate
            animation="fade-left"
            delay={0}
            threshold={0.1}
            className="smk-hero-left"
          >
            <span className="smk-badge">Tahun Ajaran 2024/2025</span>
            <h1>
              PROFIL SMK
              <br />
              NEGERI 3<br />
              BALIGE
            </h1>
            <p>
              Bergabunglah dengan kami dalam menciptakan masa depan yang cerah
              melalui pendidikan berkualitas, fasilitas modern, dan pengajaran
              yang inovatif.
            </p>
          </Animate>

          <Animate
            animation="fade-right"
            delay={150}
            threshold={0.1}
            className="smk-hero-right"
          >
            <img src={foto} alt="Gedung SMK Negeri 3 Balige" />
          </Animate>
        </div>
      </section>

      {/* ── SEJARAH & IDENTITAS ── */}
      <section className="smk-section">
        <div className="smk-container">
          <Animate animation="fade-up">
            <h2 className="smk-section-title">Sejarah &amp; Identitas</h2>
            {loading ? (
              <p className="smk-section-text" style={{ color: "#aaa" }}>
                Memuat data...
              </p>
            ) : sejarah ? (
              <p className="smk-section-text">
                {sejarah.tahun_berdiri && (
                  <strong>Berdiri sejak {sejarah.tahun_berdiri}. </strong>
                )}
                {sejarah.deskripsi}
              </p>
            ) : (
              <p className="smk-section-text" style={{ color: "#aaa" }}>
                Belum ada data sejarah & identitas.
              </p>
            )}
          </Animate>
        </div>
      </section>

      {/* ── VISI & MISI ── */}
      <section className="smk-section smk-bg-cream">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <h2 className="smk-section-title smk-title-center">
              Visi &amp; Misi
            </h2>
          </Animate>

          <div className="smk-vm-grid">
            <Animate animation="fade-left" delay={100}>
              <div className="smk-vm-card">
                <div className="smk-vm-icon" style={{ background: "#F4C430" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </div>
                <h3 className="smk-vm-title">Visi</h3>
                <p>
                  {visi ? (
                    visi.deskripsi
                  ) : (
                    <span style={{ color: "#aaa" }}>Belum ada data visi.</span>
                  )}
                </p>
              </div>
            </Animate>

            <Animate animation="fade-right" delay={200}>
              <div className="smk-vm-card">
                <div className="smk-vm-icon" style={{ background: "#5A82F2" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                  </svg>
                </div>
                <h3 className="smk-vm-title">Misi</h3>
                {misiList.length > 0 ? (
                  <ul
                    style={{
                      textAlign: "left",
                      paddingLeft: "20px",
                      lineHeight: "1.9",
                    }}
                  >
                    {misiList.map((item) => (
                      <li key={item.id}>{item.deskripsi}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#aaa" }}>Belum ada data misi.</p>
                )}
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* ── STRUKTUR ORGANISASI ── */}
      <section className="smk-section">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <h2 className="smk-section-title smk-title-center">
              Struktur Organisasi
            </h2>
          </Animate>
          <Animate animation="zoom-in" delay={100}>
            {strukturOrganisasi.length > 0 ? (
              <img
                src={toImgUrl(strukturOrganisasi[0].gambar)}
                alt="Struktur Organisasi"
                style={{
                  maxWidth: "100%",
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <p style={{ color: "#aaa" }}>
                Belum ada data struktur organisasi.
              </p>
            )}
          </Animate>
        </div>
      </section>

      {/* ── FASILITAS & SARANA ── */}
      <section className="smk-section smk-bg-cream">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <h2 className="smk-section-title smk-title-center">
              Fasilitas &amp; Sarana Belajar
            </h2>
          </Animate>
          <div className="smk-facility-grid">
            {fasilitas.length > 0 ? (
              fasilitas.map((item, idx) => (
                <Animate key={item.id} animation="zoom-in" delay={idx * 80}>
                  <div className="smk-facility-card">
                    <img
                      src={
                        toImgUrl(item.foto) ||
                        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"
                      }
                      alt={item.nama_fasilitas}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80";
                      }}
                    />
                    <span className="smk-facility-label">
                      {item.nama_fasilitas}
                    </span>
                  </div>
                </Animate>
              ))
            ) : (
              <p style={{ color: "#aaa" }}>Belum ada data fasilitas.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── AKREDITASI & PRESTASI ── */}
      <section className="smk-section">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <h2 className="smk-section-title smk-title-center">
              Akreditasi &amp; Prestasi
            </h2>
          </Animate>
          <Animate animation="fade-up" delay={100}>
            <div className="smk-prestasi-block">
              {prestasi.length > 0 ? (
                <ul className="smk-prestasi-list">
                  {prestasi.map((item, idx) => (
                    <li key={item.id}>
                      {`${idx + 1}. ${item.judul} — ${
                        item.tingkat.charAt(0).toUpperCase() +
                        item.tingkat.slice(1)
                      }, ${item.tahun}`}
                      {item.keterangan && ` (${item.keterangan})`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#aaa" }}>Belum ada data prestasi.</p>
              )}
            </div>
          </Animate>
        </div>
      </section>

      {/* ── JURUSAN / PROGRAM KEAHLIAN ── */}
      <section className="smk-section smk-bg-cream">
        <div className="smk-container smk-center">
          <Animate animation="fade-up">
            <span className="smk-badge smk-badge-outline">
              Program Keahlian
            </span>
            <h2
              className="smk-section-title smk-title-center"
              style={{ marginTop: "16px" }}
            >
              Jurusan Di SMK Negeri 3 Balige
            </h2>
            <p className="smk-section-subtitle">
              Pilihan program keahlian di SMK Negeri 3 Balige.
            </p>
          </Animate>
          <div className="smk-jurusan-grid">
            {programKeahlian.length > 0 ? (
              programKeahlian.map((item, idx) => (
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
              <p style={{ color: "#aaa" }}>Belum ada data program keahlian.</p>
            )}
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
              style={{ marginTop: "16px" }}
            >
              Mitra Kerjasama
            </h2>
          </Animate>
          <div className="smk-mitra-grid">
            {mitraKerjasama.length > 0 ? (
              mitraKerjasama.map((item, idx) => (
                <Animate key={item.id} animation="zoom-in" delay={idx * 80}>
                  <div className="smk-mitra-card">
                    {item.logo ? (
                      <img
                        src={toImgUrl(item.logo)}
                        alt={item.nama_mitra}
                        style={{
                          width: 56,
                          height: 56,
                          objectFit: "contain",
                          marginBottom: 8,
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
