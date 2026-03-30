export default function ChangeCoverModal({ onClose, onSubmit }) {
  return (
    <div className="smk-modal-overlay" onClick={onClose}>
      <div className="smk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="smk-modal-header">
          <h3>Ganti Cover</h3>
          <button className="smk-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="smk-modal-body">
          <div className="smk-form-group">
            <label>Upload Gambar Cover</label>
            <div className="smk-upload-area">
              <span>📁 Klik atau seret gambar ke sini</span>
              <input type="file" accept="image/*" style={{ display: "none" }} />
            </div>
          </div>
        </div>
        <div className="smk-modal-footer">
          <button className="smk-btn-cancel" onClick={onClose}>Batal</button>
          <button className="smk-btn-primary" onClick={onSubmit}>Upload</button>
        </div>
      </div>
    </div>
  );
}
