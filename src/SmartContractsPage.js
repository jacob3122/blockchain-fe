import { useState } from "react";
import DetailsModal from "./DetailsModal";
import { useChainData } from "./chain/useChainData";
import { contractFields } from "./chain/fields";

const short = (s) => (s ? `${s.slice(0, 6)}…${s.slice(-4)}` : "-");

const columns = [
  { label: "Address", value: (c) => short(c.address) },
  { label: "Kind", value: (c) => c.kind },
  { label: "Token", value: (c) => c.name ?? "-" },
  { label: "Symbol", value: (c) => c.symbol ?? "-" },
  { label: "Company ID", value: (c) => c.companyId ?? "-" },
  { label: "Total shares", value: (c) => c.totalSupply ?? "-" },
  { label: "Deployed in block", value: (c) => `#${c.deployBlock}` },
  { label: "Used in blocks", value: (c) => c.usedIn.map((n) => `#${n}`).join(", ") },
];

function SmartContractsPage() {
  const { contracts, loading, error, reload } = useChainData();
  const [selected, setSelected] = useState(null);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Smart contracts <span style={styles.count}>({contracts.length})</span>
        </h3>
        <button style={styles.refreshBtn} onClick={reload} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              {columns.map((col) => (
                <th key={col.label} style={styles.th}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && !error && contracts.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={styles.empty}>
                  No smart contracts yet. Deploy a company token from the Dashboard.
                </td>
              </tr>
            ) : (
              contracts.map((c) => (
                <tr key={c.address} style={styles.row} onClick={() => setSelected(c)}>
                  {columns.map((col) => (
                    <td key={col.label} style={styles.td}>{col.value(c)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <DetailsModal title={`${selected.symbol ?? "Smart"} contract`} fields={contractFields(selected)} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

const styles = {
  card: { background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { margin: 0, fontSize: 20, fontWeight: 700 },
  count: { fontSize: 15, fontWeight: 500, color: "#555" },
  refreshBtn: { padding: "8px 14px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  error: { color: "#991b1b", background: "#fef2f2", padding: "10px 12px", borderRadius: 8, fontSize: 14 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  headRow: { background: "#f5f6f8" },
  th: { textAlign: "left", padding: "12px 10px", fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" },
  row: { cursor: "pointer" },
  td: { padding: "12px 10px", borderBottom: "1px solid #f0f0f0", color: "#222", whiteSpace: "nowrap" },
  empty: { padding: 32, textAlign: "center", color: "#888" },
};

export default SmartContractsPage;