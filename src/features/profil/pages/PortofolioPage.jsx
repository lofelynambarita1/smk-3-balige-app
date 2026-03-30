import ProfilLayout from "../layouts/ProfilLayout";

const karya = [
  {
    title: "Sistem Informasi Perpustakaan",
    jurusan: "TKJ",
    siswa: "Ahmad Siregar",
    angkatan: "2023",
    desc: "Aplikasi manajemen perpustakaan berbasis web dengan fitur peminjaman dan pengembalian buku.",
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80",
    tags: ["Web Dev", "PHP", "MySQL"],
  },
  {
    title: "Video Iklan Produk Lokal",
    jurusan: "Multimedia",
    siswa: "Sari Hutabarat",
    angkatan: "2023",
    desc: "Produksi iklan video profesional untuk UMKM lokal di Kabupaten Toba menggunakan Adobe Premiere.",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&q=80",
    tags: ["Video Editing", "Motion Graphics"],
  },
  {
    title: "Laporan Keuangan Digital",
    jurusan: "Akuntansi",
    siswa: "Benny Manurung",
    angkatan: "2023",
    desc: "Sistem pencatatan keuangan otomatis menggunakan Excel VBA untuk UKM di daerah Balige.",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    tags: ["Excel VBA", "Akuntansi", "Keuangan"],
  },
  {
    title: "Desain Logo Brand Lokal",
    jurusan: "Multimedia",
    siswa: "Rina Simbolon",
    angkatan: "2022",
    desc: "Perancangan identitas visual lengkap untuk brand makanan khas Batak, meliputi logo dan kemasan.",
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    tags: ["Graphic Design", "Illustrator", "Branding"],
  },
  {
    title: "Jaringan LAN Sekolah",
    jurusan: "TKJ",
    siswa: "David Samosir",
    angkatan: "2022",
    desc: "Perancangan dan implementasi infrastruktur jaringan LAN untuk laboratorium komputer sekolah.",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
    tags: ["Networking", "Cisco", "LAN"],
  },
  {
    title: "E-Commerce UMKM Toba",
    jurusan: "TKJ",
    siswa: "Yuni Sihombing",
    angkatan: "2022",
    desc: "Platform e-commerce untuk memperkenalkan produk UMKM dari kawasan Danau Toba ke pasar nasional.",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
    tags: ["E-Commerce", "React", "Node.js"],
  },
];

const jurusanColors = {
  TKJ: "#5A82F2",
  Multimedia: "#F4C430",
  Akuntansi: "#1f2c5c",
};

const skills = [
  { nama: "Pemrograman Web", level: 85 },
  { nama: "Desain Grafis", level: 78 },
  { nama: "Jaringan Komputer", level: 90 },
  { nama: "Akuntansi Digital", level: 75 },
  { nama: "Video Editing", level: 82 },
  { nama: "Keamanan Siber", level: 70 },
];

export default function PortofolioPage() {
  return (
    <ProfilLayout>

      {/* HERO */}
      <section className="smk-subpage-hero">
        <div className="smk-container smk-center">
          <span className="smk-badge">Karya Siswa</span>
          <h1 className="smk-subpage-title">Portofolio &amp; Skill</h1>
          <p className="smk-subpage-subtitle">
            Temukan hasil karya terbaik siswa SMK Negeri 3 Balige yang mencerminkan
            kompetensi dan kreativitas mereka di berbagai bidang.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section className="smk-section" style={{ paddingTop: "40px", paddingBottom: "0" }}>
        <div className="smk-container smk-center">
          <div className="smk-berita-filters">
            {["Semua", "TKJ", "Multimedia", "Akuntansi"].map((f) => (
              <button key={f} className="smk-filter-btn">{f}</button>
            ))}
          </div>
        </div>
      </section>

      {/* KARYA GRID */}
      <section className="smk-section">
        <div className="smk-container">
          <div className="smk-porto-grid">
            {karya.map((item, idx) => (
              <div className="smk-porto-card" key={idx}>
                <div className="smk-porto-img">
                  <img src={item.img} alt={item.title} />
                  <span
                    className="smk-porto-jurusan"
                    style={{ background: jurusanColors[item.jurusan] || "#5A82F2" }}
                  >
                    {item.jurusan}
                  </span>
                </div>
                <div className="smk-porto-body">
                  <h3 className="smk-porto-title">{item.title}</h3>
                  <div className="smk-porto-meta">
                    <span>👤 {item.siswa}</span>
                    <span>· {item.angkatan}</span>
                  </div>
                  <p className="smk-porto-desc">{item.desc}</p>
                  <div className="smk-porto-tags">
                    {item.tags.map((tag, tidx) => (
                      <span className="smk-porto-tag" key={tidx}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILL */}
      <section className="smk-section smk-bg-cream">
        <div className="smk-container smk-center">
          <h2 className="smk-section-title smk-title-center">Kompetensi Unggulan</h2>
          <p className="smk-section-subtitle">
            Tingkat penguasaan kompetensi rata-rata siswa SMK Negeri 3 Balige.
          </p>
          <div className="smk-skills-grid">
            {skills.map((skill, idx) => (
              <div className="smk-skill-item" key={idx}>
                <div className="smk-skill-header">
                  <span className="smk-skill-name">{skill.nama}</span>
                  <span className="smk-skill-pct">{skill.level}%</span>
                </div>
                <div className="smk-skill-bar">
                  <div
                    className="smk-skill-fill"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </ProfilLayout>
  );
}
