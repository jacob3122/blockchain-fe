import { useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function FieldLabel({ label, required, rules }) {
  const [show, setShow] = useState(false);

  return (
    <div style={styles.row}>
      <span style={styles.label}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </span>

      {rules && (
        <span
          style={styles.iconWrap}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <InfoOutlinedIcon style={{ fontSize: 15, color: "#888", cursor: "pointer" }} />
          {show && <div style={styles.tooltip}>{rules}</div>}
        </span>
      )}
    </div>
  );
}

const styles = {
  row: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#333" },
  iconWrap: { position: "relative", display: "flex" },
  tooltip: { position: "absolute", bottom: 22, left: -10, width: 230, background: "#1f2937", color: "#fff", fontSize: 12, lineHeight: 1.4, padding: "8px 10px", borderRadius: 8, zIndex: 100 },
};

export default FieldLabel;