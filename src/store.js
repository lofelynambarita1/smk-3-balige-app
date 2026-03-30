import { configureStore } from "@reduxjs/toolkit";
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
  },
});

export default store;
