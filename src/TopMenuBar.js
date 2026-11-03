import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function TopMenuBar() {
  return (
    <header style={styles.topbar}>
      <div style={styles.search}>
        <SearchOutlinedIcon style={{ fontSize: 18, color: "#999" }} />
        <input placeholder="Search deliveries" style={styles.input} />
      </div>
    </header>
  );
}

const styles = {
  topbar: { height: 64, borderBottom: "1px solid #eee", display: "flex", justifyContent: "center", alignItems: "center", background: "#fff" },
  search: { display: "flex", alignItems: "center", gap: 8, background: "#f5f6f8", padding: "8px 14px", borderRadius: 8, width: 360 },
  input: { border: "none", outline: "none", background: "transparent", width: "100%", fontSize: 14 },
};

export default TopMenuBar;