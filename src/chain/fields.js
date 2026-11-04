import { walletName } from "./chain";

const withName = (a) => (a && a.startsWith("0x") ? `${walletName(a)} (${a})` : a);

export const blockFields = (b) => [
  ["Block", `#${b.block}`],
  ["Time", new Date(b.timestamp).toLocaleString("en-IN")],
  ["Transactions in block", b.txCount],
  ["Type", b.label],
  ["Tx hash", b.txHash],
  ["From", withName(b.from)],
  ["To", withName(b.to)],
  ["Smart contract", b.contractAddress ?? "None (plain ETH transfer)"],
  ["Gas used", b.gasUsed],
  ["Gas cost (ETH)", b.gasCostEth],
  ["Status", b.status],
];

export const contractFields = (c) => {
  const deployInfo = [
    ["Deployed in block", `#${c.deployBlock}`],
    ["Deploy tx", c.deployTx],
    ["Deployed by", withName(c.deployer)],
    ["Deploy gas used", c.gasUsed],
    ["Blocks using this contract", c.usedIn.map((n) => `#${n}`).join(", ")],
  ];
  if (c.kind !== "CompanyShareToken") {
    return [["Contract address", c.address], ["Kind", c.kind], ...deployInfo];
  }
  return [
    ["Contract address", c.address],
    ["Kind", c.kind],
    ["Token", `${c.name} (${c.symbol})`],
    ["Company ID", c.companyId],
    ["Total shares", c.totalSupply],
    ["Treasury", withName(c.treasury)],
    ["Company owner", withName(c.owner)],
    ["Platform", withName(c.platform)],
    ["Holders now", c.holders],
    ...deployInfo,
  ];
};