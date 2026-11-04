import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Pagination from "./Pagination";
import AddTokenModal from "./AddTokenModal";
import TokenDetailsModal from "./TokenDetailsModal";
import { deployCompanyToken } from "./chain/chain";

const short = (s) => (s ? `${s.slice(0, 6)}…${s.slice(-4)}` : "-");
const rupees = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const columns = [
  { key: "companyName", label: "Company" },
  { key: "companyType", label: "Type" },
  { key: "tokenSymbol", label: "Symbol" },
  { key: "contractAddress", label: "Contract address", format: short },
  { key: "sharesOnSale", label: "Shares on sale" },
  { key: "ownerShares", label: "Owner shares" },
  { key: "pricePerShare", label: "Price per share", format: rupees },
  { key: "txHash", label: "Tx hash", format: short },
  { key: "block", label: "Block" },
  { key: "gasUsed", label: "Gas used" },
  { key: "gasCostEth", label: "Gas cost (ETH)" },
  { key: "status", label: "Status" },
];

function TokenTable() {
  const [rows, setRows] = useState([]); // in memory only; gone on page refresh
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const start = (page - 1) * perPage;
  const visible = rows.slice(start, start + perPage);

  const handleSave = async (form, hasAsset) => {
    const record = await deployCompanyToken(form, hasAsset);
    setRows((prev) => [record, ...prev]);
    setPage(1);
  };

  const renderCell = (row, col) => {
    if (col.key === "status") {
      return (
        <span style={styles.status}>
          <CheckCircleIcon style={{ fontSize: 16, color: "#16a34a" }} /> {row.status}
        </span>
      );
    }
    const value = row[col.key];
    return col.format ? col.format(value) : value;
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Company tokens <span style={styles.count}>({rows.length})</span>
        </h3>
        <button style={styles.plusBtn} onClick={() => setShowAdd(true)} aria-label="Add company token">
          <AddIcon style={{ fontSize: 22 }} />
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              {columns.map((col) => (
                <th key={col.key} style={styles.th}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={styles.empty}>
                  No company tokens yet. Click + to deploy one on the local chain.
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.id} style={styles.row} onClick={() => setSelectedRow(row)}>
                  {columns.map((col) => (
                    <td key={col.key} style={styles.td}>{renderCell(row, col)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <Pagination page={page} setPage={setPage} perPage={perPage} setPerPage={setPerPage} total={rows.length} />
      )}

      {showAdd && <AddTokenModal onClose={() => setShowAdd(false)} onSave={handleSave} existingRows={rows} />}
      {selectedRow && <TokenDetailsModal row={selectedRow} onClose={() => setSelectedRow(null)} />}
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { margin: 0, fontSize: 20, fontWeight: 700 },
  count: { fontSize: 15, fontWeight: 500, color: "#555" },
  plusBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, background: "#0b66ff", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  headRow: { background: "#f5f6f8" },
  th: { textAlign: "left", padding: "12px 10px", fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" },
  row: { cursor: "pointer" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f0f0f0", color: "#222", whiteSpace: "nowrap" },
  status: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#15803d" },
  empty: { padding: 32, textAlign: "center", color: "#888" },
};

export default TokenTable;
