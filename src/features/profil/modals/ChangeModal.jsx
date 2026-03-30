export default function ChangeModal({ onClose, onSubmit, data }) {
  return (
    <div className="smk-modal-overlay" onClick={onClose}>
      <div className="smk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="smk-modal-header">
          <h3>Edit Data</h3>
          <button className="smk-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="smk-modal-body">
          <div className="smk-form-group">
            <label>Judul</label>
            <input
              type="text"
              className="smk-form-input"
              defaultValue={data?.title || ""}
              placeholder="Masukkan judul..."
            />
          </div>
          <div className="smk-form-group">
            <label>Deskripsi</label>
            <textarea
              className="smk-form-input"
              rows={4}
              defaultValue={data?.description || ""}
              placeholder="Masukkan deskripsi..."
            />
          </div>
        </div>
        <div className="smk-modal-footer">
          <button className="smk-btn-cancel" onClick={onClose}>Batal</button>
          <button className="smk-btn-primary" onClick={onSubmit}>Perbarui</button>
        </div>
      </div>
    </div>
  );
}
