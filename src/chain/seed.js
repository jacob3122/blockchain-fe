// Copied from Source/blockchain/seed (prototype, pending BC-009). Public Hardhat test addresses only, never keys.
// 0 = deployer, 1 = treasury, 2 = company owner, 3 = platform, 4-6 = investors.
export const seedWallets = [
  { id: "WALLET-DEPLOYER-001", role: "deployer", accountIndex: 0, address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
  { id: "WALLET-TREASURY-001", role: "treasury", accountIndex: 1, address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" },
  { id: "WALLET-OWNER-001", role: "owner", accountIndex: 2, address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
  { id: "WALLET-PLATFORM-001", role: "platform", accountIndex: 3, address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" },
  { id: "WALLET-INVESTOR-001", role: "investor", accountIndex: 4, address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" },
  { id: "WALLET-INVESTOR-002", role: "investor", accountIndex: 5, address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc" },
  { id: "WALLET-INVESTOR-003", role: "investor", accountIndex: 6, address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9" },
];

export const seedCompanies = [
  {
    id: "COMP-SAMPLE-001",
    name: "Green Villa Pvt Ltd",
    type: "NEW_SPV",
    assets: [
      { id: "ASSET-SAMPLE-001", name: "Green Villa", type: "villa" },
      { id: "ASSET-SAMPLE-002", name: "Green Office Space", type: "office" },
    ],
    valuation: { amountInr: 40000000, asOf: "2026-11-01" },
    offering: { id: "OFFER-SAMPLE-001", sharesOnSale: 5000 },
    token: { name: "Green Villa Shares", symbol: "GVS" },
    treasuryWalletId: "WALLET-TREASURY-001",
    ownerWalletId: "WALLET-OWNER-001",
    platformWalletId: "WALLET-PLATFORM-001",
  },
  {
    id: "COMP-SAMPLE-002",
    name: "Blue Ocean Ltd",
    type: "EXISTING_COMPANY",
    assets: [
      { id: "ASSET-SAMPLE-003", name: "Blue Ocean Office", type: "office" },
      { id: "ASSET-SAMPLE-004", name: "Blue Ocean Delivery Van", type: "vehicle" },
    ],
    valuation: { amountInr: 25000000, asOf: "2026-11-01" },
    offering: { id: "OFFER-SAMPLE-002", sharesOnSale: 3000 },
    token: { name: "Blue Ocean Shares", symbol: "BOS" },
    treasuryWalletId: "WALLET-TREASURY-001",
    ownerWalletId: "WALLET-OWNER-001",
    platformWalletId: "WALLET-PLATFORM-001",
  },
];
