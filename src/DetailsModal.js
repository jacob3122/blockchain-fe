function DetailsModal({ title, fields, onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>{title}</h3>
        <div>
          {fields.map(([label, value]) => (
            <div key={label} style={styles.item}>
              <span style={styles.label}>{label}</span>
              <span style={styles.value}>{value}</span>
            </div>
          ))}
        </div>
        <div style={styles.footer}>
          <button style={styles.closeBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 14, padding: 24, width: 720, maxHeight: "85vh", overflowY: "auto" },
  title: { margin: "0 0 16px", fontSize: 20 },
  item: { display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 },
  label: { color: "#666" },
  value: { color: "#222", wordBreak: "break-all" },
  footer: { display: "flex", justifyContent: "flex-end", marginTop: 20 },
  closeBtn: { padding: "10px 18px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14 },
};

export default DetailsModal;