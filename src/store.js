import { configureStore } from "@reduxjs/toolkit";

// PROFIL
import {
  sejarahIdentitasReducer,
  visiMisiReducer,
  strukturOrganisasiReducer,
  fasilitasReducer,
  prestasiReducer,
  programKeahlianReducer,
  mitraKerjasamaReducer,
  profilLoadingReducer,
} from "./features/profil/states/reducer";

// BERITA
import beritaReducer from "./features/berita/states/reducer";

const store = configureStore({
  reducer: {
    sejarahIdentitas: sejarahIdentitasReducer,
    visiMisi: visiMisiReducer,
    strukturOrganisasi: strukturOrganisasiReducer,
    fasilitas: fasilitasReducer,
    prestasi: prestasiReducer,
    programKeahlian: programKeahlianReducer,
    mitraKerjasama: mitraKerjasamaReducer,
    profilLoading: profilLoadingReducer,

    berita: beritaReducer,
  },
});

export default store;