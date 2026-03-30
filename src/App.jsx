import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./features/profil/components/NavbarComponent";
import Footer from "./features/profil/components/FooterComponent";

import BerandaPage from "./features/profil/pages/BerandaPage";
import ProfilPage from "./features/profil/pages/ProfilPage";
import PortofolioPage from "./features/profil/pages/PortofolioPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<BerandaPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/portofolio" element={<PortofolioPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;