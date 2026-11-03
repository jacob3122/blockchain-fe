import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";

const menus = [
  { name: "Dashboard", icon: GridViewOutlinedIcon },
  { name: "Tracking", icon: LocalShippingOutlinedIcon },
  { name: "Transactions", icon: SwapHorizOutlinedIcon },
  { name: "Reports", icon: AssessmentOutlinedIcon },
  { name: "Invoice", icon: ReceiptOutlinedIcon },
];

function BlockchainLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      <polygon points="12,2 21,7 12,12 3,7" fill="#5b9bff" />
      <polygon points="3,7 12,12 12,22 3,17" fill="#0b66ff" />
      <polygon points="21,7 21,17 12,22 12,12" fill="#0047b3" />
    </svg>
  );
}

function Sidebar({ active, setActive }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <BlockchainLogo />
        <span>Blockchain</span>
      </div>
      <p style={styles.label}>Main</p>

      {menus.map((menu) => {
        const Icon = menu.icon;
        const isActive = active === menu.name;
        return (
          <div
            key={menu.name}
            onClick={() => setActive(menu.name)}
            style={{
              ...styles.item,
              background: isActive ? "#eef4ff" : "transparent",
              color: isActive ? "#0b66ff" : "#555",
              borderLeft: isActive ? "3px solid #0b66ff" : "3px solid transparent",
            }}
          >
            <Icon style={{ fontSize: 20 }} />
            <span>{menu.name}</span>
          </div>
        );
      })}
    </aside>
  );
}

const styles = {
  sidebar: { width: 230, minHeight: "100vh", borderRight: "1px solid #eee", padding: "20px 12px", boxSizing: "border-box", background: "#fff" },
  logo: { display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 700, margin: "0 0 28px 8px" },
  label: { fontSize: 12, color: "#999", margin: "0 0 10px 8px" },
  item: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, marginBottom: 4 },
};

export default Sidebar;