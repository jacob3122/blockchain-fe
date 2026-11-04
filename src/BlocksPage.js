import { useState } from "react";
import BlockChainView from "./BlockChainView";
import DetailsModal from "./DetailsModal";
import { useChainData } from "./chain/useChainData";
import { blockFields, contractFields } from "./chain/fields";

function BlocksPage() {
  const { blocks, contracts, loading, error, reload } = useChainData();
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const openContract = (address) => setSelectedContract(contracts.find((c) => c.address === address) ?? null);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Blocks <span style={styles.count}>({blocks.length})</span>
        </h3>
        <button style={styles.refreshBtn} onClick={reload} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && blocks.length === 0 && (
        <p style={styles.empty}>No blocks yet. Deploy a company token from the Dashboard and it will show up here.</p>
      )}

      <BlockChainView blocks={blocks} onSelect={setSelectedBlock} onContract={openContract} />

      {selectedBlock && (
        <DetailsModal title={`Block #${selectedBlock.block}`} fields={blockFields(selectedBlock)} onClose={() => setSelectedBlock(null)} />
      )}
      {selectedContract && (
        <DetailsModal
          title={`${selectedContract.symbol ?? "Smart"} contract`}
          fields={contractFields(selectedContract)}
          onClose={() => setSelectedContract(null)}
        />
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
  empty: { color: "#888", textAlign: "center", padding: 32 },
};

export default BlocksPage;