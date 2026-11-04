import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const short = (s) => (s ? `${s.slice(0, 6)}…${s.slice(-4)}` : "-");

function BlockChainView({ blocks, onSelect, onContract }) {
  if (blocks.length === 0) return null;

  return (
    <div style={styles.wrap}>
      <div style={styles.chain}>
        {blocks.map((b, i) => (
          <div key={b.id} style={styles.item}>
            {i > 0 && <div style={styles.line} />}
            <div style={styles.block} onClick={() => onSelect?.(b)} title="Click for block details">
              <div style={styles.top}>
                <span style={styles.blockNo}>Block #{b.block}</span>
                {b.contractAddress && (
                  <button
                    style={styles.contractBtn}
                    title="View smart contract"
                    aria-label="View smart contract"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContract?.(b.contractAddress);
                    }}
                  >
                    <DescriptionOutlinedIcon style={{ fontSize: 18 }} />
                  </button>
                )}
              </div>
              <div style={styles.type}>{b.label}</div>
              <div style={styles.muted}>Tx {short(b.txHash)}</div>
              <div style={styles.muted}>Gas {b.gasUsed}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: "8px 0 16px" },
  chain: { display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 24 },
  item: { display: "flex", alignItems: "center" },
  line: { height: 2, width: 45, backgroundColor: "red", flexShrink: 0 },
  block: { minHeight: 110, width: 210, flexShrink: 0, padding: 10, boxSizing: "border-box", backgroundColor: "#f3f4f6", border: "2px solid #000", borderRadius: 6, fontSize: 13, cursor: "pointer" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  blockNo: { fontWeight: 700 },
  type: { fontSize: 12, color: "#2563eb", fontWeight: 600, marginBottom: 2 },
  contractBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#3730a3", borderRadius: 6, cursor: "pointer", padding: 0 },
  muted: { color: "#555" },
};

export default BlockChainView;