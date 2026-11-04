const rupees = (n) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

function TokenDetailsModal({ row, onClose }) {
  const fields = [
    ["Company ID", row.companyId],
    ["Company name", row.companyName],
    ["Company type", row.companyType],
    ["Asset", row.assetId ? `${row.assetName} (${row.assetType}, ${row.assetId})` : "-"],
    ["Valuation (₹)", rupees(row.valuation)],
    ["Valuation date", row.valuationDate],
    ["Offering ID", row.offeringId],
    ["Token name", row.tokenName],
    ["Token symbol", row.tokenSymbol],
    ["Contract address", row.contractAddress],
    ["Shares on sale (treasury)", row.sharesOnSale],
    ["Owner shares", row.ownerShares],
    ["Platform shares", row.platformShares],
    ["Total shares", row.totalShares],
    ["Price per share (₹)", rupees(row.pricePerShare)],
    ["Treasury wallet", row.treasuryWallet],
    ["Owner wallet", row.ownerWallet],
    ["Platform wallet", row.platformWallet],
    ["Deployer", row.deployer],
    ["Tx hash", row.txHash],
    ["Block", row.block],
    ["Gas used", row.gasUsed],
    ["Gas cost (ETH)", row.gasCostEth],
    ["Deployed at", new Date(row.deployedAt).toLocaleString("en-IN")],
    ["Status", row.status],
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>{row.companyName} ({row.tokenSymbol})</h3>
        <div style={styles.list}>
          {fields.map(([label, value]) => (
            <div key={label} style={styles.item}>
              <span style={styles.label}>{label}</span>
              <span style={styles.value}>{value}</span>
            </div>
          ))}
        </div>
        <div style={styles.footer}>
          <button style={styles.closeBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 14, padding: 24, width: 720, maxHeight: "85vh", overflowY: "auto" },
  title: { margin: "0 0 16px", fontSize: 20 },
  list: { display: "flex", flexDirection: "column" },
  item: { display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 },
  label: { color: "#666" },
  value: { color: "#222", wordBreak: "break-all" },
  footer: { display: "flex", justifyContent: "flex-end", marginTop: 20 },
  closeBtn: { padding: "10px 18px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14 },
};

export default TokenDetailsModal;
