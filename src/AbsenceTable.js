import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import AddTokenModal from "./AddTokenModal";

// Column names – later these can come from the API
const columns = [
  { key: "name", label: "Employee" },
  { key: "date", label: "Date" },
  { key: "days", label: "# of Days" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "paid", label: "Paid" },
];

// Fake data
const baseRows = [
  { name: "Mike Sheen", avatar: "https://i.pravatar.cc/40?img=12", date: "Jun 8 — Jun 11, 2023", days: "4 Days", type: "Sick Leave", status: "Approved", paid: "60%" },
  { name: "Lisbeth Nielsen", avatar: "https://i.pravatar.cc/40?img=47", date: "Jul 1 — Jul 21, 2023", days: "21 Days", type: "Sabbatical", status: "Approved", paid: "Yes" },
  { name: "Abby Gail", avatar: "https://i.pravatar.cc/40?img=45", date: "Jul 15, 2023", days: "1 Day", type: "Vacation", status: "Approved", paid: "Yes" },
  { name: "Drew Smith", avatar: "", date: "Aug 23 — Aug 24, 2023", days: "2 Days", type: "Vacation", status: "Pending", paid: "Yes" },
  { name: "Alison Paul", avatar: "", date: "Sep 12, 2023", days: "1 Day", type: "Education", status: "Approved", paid: "No" },
  { name: "Mike Perkins", avatar: "https://i.pravatar.cc/40?img=13", date: "Sep 15 — Sep 19, 2023", days: "5 Days", type: "Vacation", status: "Pending", paid: "Yes" },
  { name: "Kate Smith", avatar: "https://i.pravatar.cc/40?img=32", date: "Oct 25 — Oct 27, 2023", days: "3 Days", type: "Vacation", status: "Requested", paid: "Yes" },
  { name: "Will Brown", avatar: "https://i.pravatar.cc/40?img=15", date: "Dec 14 — Dec 16, 2023", days: "2 Days", type: "Vacation", status: "Rejected", paid: "Yes" },
  { name: "Sam Goodman", avatar: "", date: "Dec 1 — Dec 15, 2023", days: "14 Days", type: "Sabbatical", status: "Pending", paid: "Yes" },
  { name: "Olivia Stonewell", avatar: "", date: "Dec 27 — Dec 28, 2023", days: "2 Days", type: "Relocation", status: "Requested", paid: "Yes" },
];
const data = Array.from({ length: 37 }, (_, i) => ({ ...baseRows[i % 10], id: i + 1 }));

const typeStyles = {
  "Sick Leave": { icon: HealingOutlinedIcon, bg: "#fdf6dc", color: "#7a6200" },
  Sabbatical: { icon: WbSunnyOutlinedIcon, bg: "#f1ebfc", color: "#6b3fc4" },
  Vacation: { icon: BeachAccessOutlinedIcon, bg: "#e8f6ee", color: "#1f7a4d" },
  Education: { icon: SchoolOutlinedIcon, bg: "#fdeee4", color: "#a3541c" },
  Relocation: { icon: HomeWorkOutlinedIcon, bg: "#e4f5f1", color: "#1d6e60" },
};

const statusStyles = {
  Approved: { icon: CheckCircleIcon, color: "#16a34a", text: "#15803d" },
  Pending: { icon: AccessTimeFilledIcon, color: "#f59e0b", text: "#92400e" },
  Requested: { icon: RadioButtonCheckedIcon, color: "#2563eb", text: "#1e40af" },
  Rejected: { icon: CancelIcon, color: "#dc2626", text: "#991b1b" },
};

const bulkOptions = ["Approve selected", "Reject selected", "Delete selected"];
const initialsColors = [
  { bg: "#ede9fe", color: "#6d28d9" },
  { bg: "#ffedd5", color: "#c2410c" },
];

function AbsenceTable() {
    const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [bulkOpen, setBulkOpen] = useState(false);

  // close bulk dropdown on outside click
  useEffect(() => {
    const close = () => setBulkOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const start = (page - 1) * perPage;
  const rows = data.slice(start, start + perPage);
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const toggleRow = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () => {
    const ids = rows.map((r) => r.id);
    setSelected((prev) =>
      allChecked ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  const renderCell = (row, key) => {
    if (key === "name") {
      const c = initialsColors[row.id % 2];
      return (
        <div style={styles.nameCell}>
          {row.avatar ? (
            <img src={row.avatar} alt="" style={styles.avatar} />
          ) : (
            <div style={{ ...styles.avatar, ...styles.initials, background: c.bg, color: c.color }}>
              {row.name.split(" ").map((w) => w[0]).join("")}
            </div>
          )}
          {row.name}
        </div>
      );
    }
    if (key === "date") return <span style={{ fontWeight: 600 }}>{row.date}</span>;
    if (key === "type") {
      const t = typeStyles[row.type];
      const Icon = t.icon;
      return (
        <span style={{ ...styles.badge, background: t.bg, color: t.color }}>
          <Icon style={{ fontSize: 15 }} /> {row.type}
        </span>
      );
    }
    if (key === "status") {
      const s = statusStyles[row.status];
      const Icon = s.icon;
      return (
        <span style={{ ...styles.status, color: s.text }}>
          <Icon style={{ fontSize: 16, color: s.color }} /> {row.status}
        </span>
      );
    }
    return row[key];
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          Absence Requests <span style={styles.count}>({data.length})</span>
        </h3>

        <div style={{ display: "flex", gap: 10 }}>
  <button style={styles.plusBtn} onClick={() => setShowModal(true)}>
    <AddIcon style={{ fontSize: 22 }} />
  </button>

  <div style={{ position: "relative" }}>
    <button
      style={styles.bulkBtn}
      onClick={(e) => {
        e.stopPropagation();
        setBulkOpen(!bulkOpen);
      }}
    >
      Bulk Actions <KeyboardArrowDownIcon style={{ fontSize: 20 }} />
    </button>
    {bulkOpen && (
      <div style={styles.menu}>
        {bulkOptions.map((opt) => (
          <div key={opt} style={styles.menuItem}>{opt}</div>
        ))}
      </div>
    )}
  </div>
</div>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.headRow}>
            <th style={{ ...styles.th, width: 40, borderRadius: "8px 0 0 8px" }}>
              <input type="checkbox" checked={allChecked} onChange={toggleAll} style={styles.checkbox} />
            </th>
            {columns.map((col, i) => (
              <th
                key={col.key}
                style={{ ...styles.th, borderRadius: i === columns.length - 1 ? "0 8px 8px 0" : 0 }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td style={styles.td}>
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={() => toggleRow(row.id)}
                  style={styles.checkbox}
                />
              </td>
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>{renderCell(row, col.key)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        total={data.length}
      />
      {showModal && <AddTokenModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { margin: 0, fontSize: 20, fontWeight: 700 },
  count: { fontSize: 15, fontWeight: 500, color: "#555" },
  bulkBtn: { display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "#fff", border: "1px solid #ddd", borderRadius: 10, fontSize: 15, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  headRow: { background: "#f5f6f8" },
  th: { textAlign: "left", padding: "12px 10px", fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.4 },
  td: { padding: "12px 10px", borderBottom: "1px solid #f0f0f0", color: "#222" },
  checkbox: { width: 16, height: 16, accentColor: "#2563eb", cursor: "pointer" },
  nameCell: { display: "flex", alignItems: "center", gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: 8, objectFit: "cover" },
  initials: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 },
  badge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 500 },
  status: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 },
  menu: { position: "absolute", right: 0, top: 48, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: 6, zIndex: 10, minWidth: 170 },
  menuItem: { padding: "9px 12px", fontSize: 14, cursor: "pointer", borderRadius: 6 },
  plusBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, background: "#0b66ff", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" },
};

export default AbsenceTable;

