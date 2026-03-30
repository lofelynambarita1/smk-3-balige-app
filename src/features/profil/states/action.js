// ================= ACTION TYPES =================
export const ActionType = {
  SET_SEJARAH: "SET_SEJARAH",
  SET_VISI_MISI: "SET_VISI_MISI",
  SET_PROGRAM_KEAHLIAN: "SET_PROGRAM_KEAHLIAN",
  SET_MITRA: "SET_MITRA",
  SET_PRESTASI: "SET_PRESTASI",
};

// ================= ACTION =================
export const setSejarah = (payload) => ({
  type: ActionType.SET_SEJARAH,
  payload,
});

export const setVisiMisi = (payload) => ({
  type: ActionType.SET_VISI_MISI,
  payload,
});

export const setProgramKeahlian = (payload) => ({
  type: ActionType.SET_PROGRAM_KEAHLIAN,
  payload,
});

export const setMitra = (payload) => ({
  type: ActionType.SET_MITRA,
  payload,
});

export const setPrestasi = (payload) => ({
  type: ActionType.SET_PRESTASI,
  payload,
});

// ================= ASYNC =================
export const asyncLoadAllProfilData = () => async (dispatch) => {
  dispatch(
    setVisiMisi([
      { id: 1, tipe: "visi", deskripsi: "Menjadi sekolah unggul." },
      { id: 2, tipe: "misi", deskripsi: "Meningkatkan kualitas pendidikan." },
    ]),
  );

  dispatch(
    setSejarah([{ id: 1, deskripsi: "Sekolah berdiri sejak 1990." }]),
  );
};

export const asyncGetProgramKeahlian = () => async (dispatch) => {
  dispatch(
    setProgramKeahlian([
      {
        id: 1,
        nama_jurusan: "RPL",
        deskripsi: "Rekayasa Perangkat Lunak",
        icon: "💻",
      },
      {
        id: 2,
        nama_jurusan: "TKJ",
        deskripsi: "Teknik Komputer Jaringan",
        icon: "🌐",
      },
    ]),
  );
};

export const asyncGetMitraKerjasama = () => async (dispatch) => {
  dispatch(
    setMitra([
      { id: 1, nama_mitra: "Telkom" },
      { id: 2, nama_mitra: "Indosat" },
    ]),
  );
};

export const asyncGetPrestasi = () => async (dispatch) => {
  dispatch(
    setPrestasi([
      { id: 1, nama: "Juara 1 LKS" },
      { id: 2, nama: "Juara 2 UI/UX" },
    ]),
  );
};