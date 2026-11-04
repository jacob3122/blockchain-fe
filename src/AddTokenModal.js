import { useState } from "react";
import TextField from "./TextField";
import Dropdown from "./Dropdown";
import { seedCompanies, seedWallets } from "./chain/seed";

const roleLabels = { treasury: "Treasury", owner: "Company owner", platform: "Platform" };
const short = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;
const walletsFor = (role) =>
  seedWallets
    .filter((w) => w.role === role)
    .map((w) => ({ value: w.address, label: `#${w.accountIndex} ${roleLabels[role]} – ${short(w.address)}` }));
const walletAddress = (walletId) => seedWallets.find((w) => w.id === walletId)?.address ?? "";

const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

const topFields = [
  { name: "companyName", label: "Company name", placeholder: "Green Villa Pvt Ltd", required: true, rules: "Mandatory; can't be empty." },
  { name: "companyType", label: "Company type", kind: "select", placeholder: "Select company type", required: true, rules: "Mandatory; choose NEW_SPV or EXISTING_COMPANY.",
    options: [{ value: "NEW_SPV", label: "NEW_SPV" }, { value: "EXISTING_COMPANY", label: "EXISTING_COMPANY" }] },
];

const assetFields = [
  { name: "assetId", label: "Asset ID", placeholder: "ASSET-SAMPLE-001", required: true, rules: "Only if an asset row is added; can't be empty, must be unique." },
  { name: "assetName", label: "Asset name", placeholder: "Green Villa", required: true, rules: "Only if an asset row is added; can't be empty." },
  { name: "assetType", label: "Asset type", kind: "select", placeholder: "Select asset type", required: true, rules: "Only if an asset row is added; pick one type.",
    options: ["villa", "office", "vehicle", "land", "other"].map((t) => ({ value: t, label: t })) },
];

const restFields = [
  { name: "valuation", label: "Valuation (₹)", type: "number", placeholder: "40000000", required: true, rules: "Mandatory; whole rupees above 0, ending in 00." },
  { name: "valuationDate", label: "Valuation date", type: "date", max: today, placeholder: "2026-11-01", required: true, rules: "Mandatory; no future dates." },
  { name: "tokenName", label: "Token name", placeholder: "Green Villa Shares", required: true, rules: "Mandatory; can't be empty." },
  { name: "tokenSymbol", label: "Token symbol", placeholder: "GVS", required: true, rules: "Mandatory; 3–5 capital letters, must be unique." },
  { name: "companyId", label: "Company ID", placeholder: "COMP-SAMPLE-001", required: true, rules: "Mandatory; can't be empty, must be unique." },
  { name: "offeringId", label: "Offering ID", placeholder: "OFFER-SAMPLE-001", required: true, rules: "Mandatory; can't be empty, must be unique." },
  { name: "treasuryWallet", label: "Treasury wallet", kind: "select", placeholder: "Select treasury wallet", required: true, rules: "Mandatory; only the treasury wallet.", options: walletsFor("treasury") },
  { name: "ownerWallet", label: "Owner wallet", kind: "select", placeholder: "Select owner wallet", required: true, rules: "Mandatory; only owner wallets.", options: walletsFor("owner") },
  { name: "platformWallet", label: "Platform wallet", kind: "select", placeholder: "Select platform wallet", required: true, rules: "Mandatory; only the platform wallet.", options: walletsFor("platform") },
  { name: "sharesOnSale", label: "Shares on sale", type: "number", step: 100, placeholder: "5000", required: true, rules: "Mandatory; whole number 100–9,900, in steps of 100." },
];

const emptyForm = Object.fromEntries([...topFields, ...assetFields, ...restFields].map((f) => [f.name, ""]));

const autofillOptions = seedCompanies.map((c) => ({ value: c.id, label: `${c.name} (${c.token.symbol})` }));

// Fills the form from one seed company (the modal has one asset row, so only the first asset is used).
function fillFromSeed(c) {
  const asset = c.assets[0];
  return {
    companyName: c.name,
    companyType: c.type,
    assetId: asset?.id ?? "",
    assetName: asset?.name ?? "",
    assetType: asset?.type ?? "",
    valuation: String(c.valuation.amountInr),
    valuationDate: c.valuation.asOf,
    tokenName: c.token.name,
    tokenSymbol: c.token.symbol,
    companyId: c.id,
    offeringId: c.offering.id,
    treasuryWallet: walletAddress(c.treasuryWalletId),
    ownerWallet: walletAddress(c.ownerWalletId),
    platformWallet: walletAddress(c.platformWalletId),
    sharesOnSale: String(c.offering.sharesOnSale),
  };
}

function validate(form, hasAsset, existing) {
  const e = {};
  const isEmpty = (v) => !String(v).trim();
  const isWhole = (v) => /^\d+$/.test(String(v));

  if (isEmpty(form.companyName)) e.companyName = "Company name is required";
  if (!form.companyType) e.companyType = "Select company type";

  if (hasAsset) {
    if (isEmpty(form.assetId)) e.assetId = "Asset ID is required";
    else if (existing.assetId.includes(form.assetId.trim())) e.assetId = "Asset ID already exists";
    if (isEmpty(form.assetName)) e.assetName = "Asset name is required";
    if (!form.assetType) e.assetType = "Select asset type";
  }

  const val = Number(form.valuation);
  if (isEmpty(form.valuation)) e.valuation = "Valuation is required";
  else if (!isWhole(form.valuation) || val <= 0 || val % 100 !== 0) e.valuation = "Whole rupees above 0, ending in 00";

  if (!form.valuationDate) e.valuationDate = "Valuation date is required";
  else if (form.valuationDate > today) e.valuationDate = "Future dates are not allowed";

  if (isEmpty(form.tokenName)) e.tokenName = "Token name is required";

  if (isEmpty(form.tokenSymbol)) e.tokenSymbol = "Token symbol is required";
  else if (!/^[A-Z]{3,5}$/.test(form.tokenSymbol)) e.tokenSymbol = "3–5 capital letters only";
  else if (existing.tokenSymbol.includes(form.tokenSymbol)) e.tokenSymbol = "Token symbol already exists";

  if (isEmpty(form.companyId)) e.companyId = "Company ID is required";
  else if (existing.companyId.includes(form.companyId.trim())) e.companyId = "Company ID already exists";

  if (isEmpty(form.offeringId)) e.offeringId = "Offering ID is required";
  else if (existing.offeringId.includes(form.offeringId.trim())) e.offeringId = "Offering ID already exists";

  if (!form.treasuryWallet) e.treasuryWallet = "Select treasury wallet";
  if (!form.ownerWallet) e.ownerWallet = "Select owner wallet";
  if (!form.platformWallet) e.platformWallet = "Select platform wallet";

  const shares = Number(form.sharesOnSale);
  if (isEmpty(form.sharesOnSale)) e.sharesOnSale = "Shares on sale is required";
  else if (!isWhole(form.sharesOnSale) || shares < 100 || shares > 9900 || shares % 100 !== 0)
    e.sharesOnSale = "100 to 9,900, in steps of 100";

  return e;
}

function AddTokenModal({ onClose, onSave, existingRows = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [hasAsset, setHasAsset] = useState(false);
  const [autofill, setAutofill] = useState("");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const existing = {
    tokenSymbol: existingRows.map((r) => r.tokenSymbol),
    companyId: existingRows.map((r) => r.companyId),
    offeringId: existingRows.map((r) => r.offeringId),
    assetId: existingRows.map((r) => r.assetId).filter(Boolean),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAutofill = (e) => {
    const company = seedCompanies.find((c) => c.id === e.target.value);
    setAutofill(e.target.value);
    if (!company) return;
    setForm(fillFromSeed(company));
    setHasAsset(company.assets.length > 0);
    setErrors({});
    setSubmitError("");
  };

  const handleSubmit = async () => {
    const errs = validate(form, hasAsset, existing);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    setSubmitError("");
    try {
      await onSave(form, hasAsset);
      onClose();
    } catch (err) {
      setSubmitError(err?.shortMessage || err?.reason || err?.message || "Deploy failed");
    } finally {
      setSaving(false);
    }
  };

  const renderField = (f) => {
    const common = {
      key: f.name,
      label: f.label,
      name: f.name,
      value: form[f.name],
      onChange: handleChange,
      placeholder: f.placeholder,
      required: f.required,
      rules: f.rules,
      error: errors[f.name],
    };
    return f.kind === "select" ? (
      <Dropdown {...common} options={f.options} />
    ) : (
      <TextField {...common} type={f.type} max={f.max} step={f.step} />
    );
  };

  return (
    <div style={styles.overlay} onClick={saving ? undefined : onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Add company token</h3>

        <div style={styles.grid}>
          <div style={styles.fullRow}>
            <Dropdown
              label="Autofill from sample data"
              name="autofill"
              value={autofill}
              onChange={handleAutofill}
              placeholder="Select a sample company"
              options={autofillOptions}
              rules="Optional; fills every field from the seed sample (first asset only)."
            />
          </div>

          {topFields.map(renderField)}

          <div style={styles.fullRow}>
            <button style={styles.linkBtn} onClick={() => setHasAsset(!hasAsset)}>
              {hasAsset ? "− Remove asset" : "+ Add asset"}
            </button>
          </div>
          {hasAsset && assetFields.map(renderField)}

          {restFields.map(renderField)}
        </div>

        {submitError && <div style={styles.errorBox}>{submitError}</div>}

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={saving}>Cancel</button>
          <button style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSubmit} disabled={saving}>
            {saving ? "Deploying…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "#fff", borderRadius: 14, padding: 24, width: 720, maxHeight: "85vh", overflowY: "auto" },
  title: { margin: "0 0 20px", fontSize: 20 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  fullRow: { gridColumn: "1 / -1" },
  linkBtn: { background: "none", border: "none", color: "#2563eb", fontWeight: 600, fontSize: 14, cursor: "pointer", padding: 0 },
  errorBox: { marginTop: 16, padding: "10px 12px", background: "#fef2f2", color: "#991b1b", borderRadius: 8, fontSize: 13, wordBreak: "break-word" },
  footer: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 },
  cancelBtn: { padding: "10px 18px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14 },
  submitBtn: { padding: "10px 18px", border: "none", background: "#0b66ff", color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 },
};

export default AddTokenModal;
