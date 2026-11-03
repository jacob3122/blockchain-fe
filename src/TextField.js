import FieldLabel from "./FieldLabel";

function TextField({ label, name, value, onChange, placeholder, required, rules, error, type = "text", ...rest }) {
  return (
    <div style={styles.wrap}>
      <FieldLabel label={label} required={required} rules={rules} />
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...styles.input, borderColor: error ? "#dc2626" : "#ddd" }}
        {...rest}
      />
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column" },
  input: { padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" },
  error: { color: "#dc2626", fontSize: 12, marginTop: 4 },
};

export default TextField;