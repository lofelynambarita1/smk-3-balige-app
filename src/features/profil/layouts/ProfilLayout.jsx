import Navbar from "../components/NavbarComponent";
import Footer from "../components/FooterComponent";

export default function ProfilLayout({ children }) {
  return (
    <>
      <Navbar />

      <main style={{ minHeight: "100vh" }}>
        {children}
      </main>

      <Footer />
    </>
  );
}