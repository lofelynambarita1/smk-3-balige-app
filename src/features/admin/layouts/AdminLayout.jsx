// src/features/admin/layouts/AdminLayout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { showConfirmDialog } from "../../../helpers/toolsHelper";

export default function AdminLayout({ children, title = "Admin Panel" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await showConfirmDialog("Apakah kamu yakin ingin keluar?");
    if (result.isConfirmed) {
      localStorage.removeItem("accessToken");
      navigate("/admin/login");
    }
  };

  const navItem = (to, icon, label, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) => `smk-admin-nav-item${isActive ? " active" : ""}`}
      onClick={() => setSidebarOpen(false)}
    >
      <span className="smk-admin-nav-icon">{icon}</span>
      {label}
    </NavLink>
  );

  return (
    <div className="smk-admin-layout">
      {sidebarOpen && (
        <div className="smk-admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`smk-admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="smk-admin-brand">
          <div className="smk-admin-brand-logo">S3</div>
          <div className="smk-admin-brand-text">
            <strong>SMK N3 Balige</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="smk-admin-nav">
          <span className="smk-admin-nav-label">Utama</span>
          {navItem("/admin", "🏠", "Dashboard", true)}

          <span className="smk-admin-nav-label">Berita</span>
          {navItem("/admin/berita", "📰", "Berita & Informasi")}

          <span className="smk-admin-nav-label">Profil Sekolah</span>
          {navItem("/admin/sejarah",   "📜", "Sejarah & Identitas")}
          {navItem("/admin/visi-misi", "🌟", "Visi & Misi")}
          {navItem("/admin/struktur",  "🏢", "Struktur Organisasi")}
          {navItem("/admin/program",   "🎓", "Program Keahlian")}
          {navItem("/admin/fasilitas", "🏫", "Fasilitas")}
          {navItem("/admin/prestasi",  "🏆", "Prestasi")}
          {navItem("/admin/mitra",     "🤝", "Mitra Kerjasama")}
        </nav>

        <div className="smk-admin-sidebar-footer">
          <NavLink to="/" target="_blank" className="smk-admin-nav-item">
            <span className="smk-admin-nav-icon">🌐</span>
            Lihat Website
          </NavLink>
          <button className="smk-admin-nav-item smk-admin-logout" onClick={handleLogout}>
            <span className="smk-admin-nav-icon">🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      <div className="smk-admin-main">
        <header className="smk-admin-topbar">
          <button className="smk-admin-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <h1 className="smk-admin-topbar-title">{title}</h1>
          <div className="smk-admin-topbar-right">
            <div className="smk-admin-user">
              <div className="smk-admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <div className="smk-admin-content">{children}</div>
      </div>
    </div>
  );
}
