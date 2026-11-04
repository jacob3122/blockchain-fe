import { ContractFactory, JsonRpcProvider, formatEther, getBigInt } from "ethers";
import artifact from "./CompanyShareToken.json";

// Demo only: the browser talks to the local Hardhat node, which signs with its own test account #0.
// Production: NestJS does this; the browser never signs.
const RPC_URL = "http://127.0.0.1:8545";
const provider = new JsonRpcProvider(RPC_URL, 31337, { staticNetwork: true });

export async function deployCompanyToken(form, hasAsset) {
  let chainIdHex;
  try {
    chainIdHex = await provider.send("eth_chainId", []);
  } catch {
    throw new Error("Can't reach the local chain at 127.0.0.1:8545. Is `npx hardhat node` running?");
  }
    if (getBigInt(chainIdHex) !== 31337n) throw new Error(`Local chain only (chain ID 31337). Connected to ${getBigInt(chainIdHex)}.`);

  const deployer = await provider.getSigner(0);
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const token = await factory.deploy(
    form.tokenName,
    form.tokenSymbol,
    form.companyId,
    form.offeringId,
    form.treasuryWallet,
    form.ownerWallet,
    form.platformWallet,
    getBigInt(form.sharesOnSale),
  );
  const receipt = await token.deploymentTransaction().wait();
  if (!receipt || receipt.status !== 1) throw new Error("Deploy transaction failed");

  const contractAddress = await token.getAddress();

  // Read the real balances back from the chain.
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
    offeringId: form.offeringId,
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
