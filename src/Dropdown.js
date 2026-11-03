import FieldLabel from "./FieldLabel";

function Dropdown({ label, name, value, onChange, placeholder, options, required, rules, error }) {
  return (
    <div style={styles.wrap}>
      <FieldLabel label={label} required={required} rules={rules} />
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          ...styles.select,
          borderColor: error ? "#dc2626" : "#ddd",
          color: value ? "#222" : "#999",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ color: "#222" }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column" },
  select: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff", cursor: "pointer" },
  error: { color: "#dc2626", fontSize: 12, marginTop: 4 },
};

export default Dropdown;