import { Contract, ContractFactory, Interface, JsonRpcProvider, formatEther, getBigInt } from "ethers";
import artifact from "./CompanyShareToken.json";
import { seedWallets } from "./seed";

// Demo only: the browser talks to the local Hardhat node, which signs with its own test account #0.
// Production: NestJS does this; the browser never signs.
const RPC_URL = "http://127.0.0.1:8545";
const provider = new JsonRpcProvider(RPC_URL, 31337, { staticNetwork: true });
const iface = new Interface(artifact.abi);

const LABEL = { DEPLOY: "Contract deploy", TRANSFER: "Token transfer", CALL: "Contract call", ETH_TRANSFER: "ETH transfer" };
const roleLabels = { deployer: "Deployer", treasury: "Treasury", owner: "Company owner", platform: "Platform", investor: "Investor" };
const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "-");

// Friendly name for a known test wallet, else a short address.
export function walletName(address) {
  if (!address) return "-";
  const w = seedWallets.find((x) => x.address.toLowerCase() === address.toLowerCase());
  return w ? `${roleLabels[w.role]} #${w.accountIndex}` : short(address);
}

async function checkLocalChain() {
  let chainIdHex;
  try {
    chainIdHex = await provider.send("eth_chainId", []);
  } catch {
    throw new Error("Can't reach the local chain at 127.0.0.1:8545. Is `npx hardhat node` running?");
  }
  if (getBigInt(chainIdHex) !== 31337n) throw new Error(`Local chain only (chain ID 31337). Connected to ${getBigInt(chainIdHex)}.`);
}

export async function deployCompanyToken(form, hasAsset) {
  await checkLocalChain();

  const deployer = await provider.getSigner(0);
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const token = await factory.deploy(
    form.tokenName,
    form.tokenSymbol,
    form.companyId,
    form.treasuryWallet,
    form.ownerWallet,
    form.platformWallet,
    getBigInt(form.sharesOnSale),
  );
  const receipt = await token.deploymentTransaction().wait();
  if (!receipt || receipt.status !== 1) throw new Error("Deploy transaction failed");

  const contractAddress = await token.getAddress();
  const [onSale, ownerShares, platformShares, totalShares] = await Promise.all([
    token.balanceOf(form.treasuryWallet),
    token.balanceOf(form.ownerWallet),
    token.balanceOf(form.platformWallet),
    token.totalSupply(),
  ]);

  return {
    id: contractAddress,
    companyId: form.companyId,
    companyName: form.companyName,
    companyType: form.companyType,
    assetId: hasAsset ? form.assetId : "",
    assetName: hasAsset ? form.assetName : "",
    assetType: hasAsset ? form.assetType : "",
    valuation: Number(form.valuation),
    valuationDate: form.valuationDate,
    tokenName: form.tokenName,
    tokenSymbol: form.tokenSymbol,
    contractAddress,
    treasuryWallet: form.treasuryWallet,
    ownerWallet: form.ownerWallet,
    platformWallet: form.platformWallet,
    deployer: await deployer.getAddress(),
    sharesOnSale: Number(onSale),
    ownerShares: Number(ownerShares),
    platformShares: Number(platformShares),
    totalShares: Number(totalShares),
    pricePerShare: Number(form.valuation) / Number(totalShares),
    txHash: receipt.hash,
    block: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    gasCostEth: formatEther(receipt.gasUsed * receipt.gasPrice),
    deployedAt: new Date().toISOString(),
    status: "Confirmed",
  };
}

// Reads one deployed contract. Works fully for CompanyShareToken; anything else (e.g. Counter) is "Other contract".
async function readContract(address, transferRecipients) {
  const token = new Contract(address, artifact.abi, provider);
  try {
    const [name, symbol, companyId, totalSupply, treasury, owner, platform] = await Promise.all([
      token.name(), token.symbol(), token.companyId(),
      token.totalSupply(), token.treasury(), token.companyOwner(), token.platform(),
    ]);
    const holderAddresses = [...new Set([treasury, owner, platform, ...transferRecipients])];
    const balances = await Promise.all(holderAddresses.map((a) => token.balanceOf(a)));
    const holders = holderAddresses
      .map((a, i) => [a, balances[i]])
      .filter(([, balance]) => balance > 0n)
      .map(([a, balance]) => `${walletName(a)}: ${balance}`)
      .join(", ");
    return { kind: "CompanyShareToken", name, symbol, companyId, totalSupply: Number(totalSupply), treasury, owner, platform, holders };
  } catch {
    return { kind: "Other contract" };
  }
}

// Reads every block from the local chain (automine = one transaction per block).
export async function loadChain() {
  await checkLocalChain();
  const latest = await provider.getBlockNumber();
  const blocks = [];
  const contractMap = new Map();

  for (let n = 1; n <= latest; n++) {
    const block = await provider.getBlock(n);
    if (!block || block.transactions.length === 0) continue;

    const hash = block.transactions[0];
    const [tx, receipt] = await Promise.all([provider.getTransaction(hash), provider.getTransactionReceipt(hash)]);

    let type = "ETH_TRANSFER";
    let contractAddress = null;
    let summary = `${formatEther(tx.value)} ETH: ${walletName(tx.from)} → ${walletName(tx.to)}`;

    if (receipt.contractAddress) {
      type = "DEPLOY";
      contractAddress = receipt.contractAddress;
      summary = "Deployed a contract";
      contractMap.set(contractAddress, {
        address: contractAddress, deployBlock: n, deployTx: hash, deployer: tx.from,
        gasUsed: receipt.gasUsed.toString(), usedIn: [n], recipients: [],
      });
    } else if (tx.to && (await provider.getCode(tx.to)) !== "0x") {
      type = "CALL";
      contractAddress = tx.to;
      summary = `Called ${short(tx.to)}`;
      let parsed = null;
      try {
        parsed = iface.parseTransaction({ data: tx.data, value: tx.value });
      } catch {
        parsed = null;
      }
      if (parsed?.name === "transfer") {
        type = "TRANSFER";
        summary = `${parsed.args[1]} tokens: ${walletName(tx.from)} → ${walletName(parsed.args[0])}`;
        contractMap.get(tx.to)?.recipients.push(parsed.args[0]);
      }
      contractMap.get(tx.to)?.usedIn.push(n);
    }

    blocks.push({
      id: String(n),
      block: n,
      timestamp: block.timestamp * 1000,
      txCount: block.transactions.length,
      type,
      label: LABEL[type],
      summary,
      txHash: hash,
      from: tx.from,
      to: tx.to ?? "-",
      contractAddress,
      gasUsed: receipt.gasUsed.toString(),
      gasCostEth: formatEther(receipt.gasUsed * receipt.gasPrice),
      status: receipt.status === 1 ? "Confirmed" : "Failed",
    });
  }

  const contracts = [];
  for (const c of contractMap.values()) {
    contracts.push({ ...c, ...(await readContract(c.address, c.recipients)) });
  }

  // Put token symbols into the block summaries.
  for (const b of blocks) {
    const c = contracts.find((x) => x.address === b.contractAddress);
    if (!c?.symbol) continue;
    if (b.type === "DEPLOY") b.summary = `Deployed ${c.symbol}`;
    if (b.type === "TRANSFER") b.summary = b.summary.replace("tokens", c.symbol);
  }

  return { blocks, contracts };
}