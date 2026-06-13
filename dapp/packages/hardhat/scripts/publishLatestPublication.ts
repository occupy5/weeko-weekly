import password from "@inquirer/password";
import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { Contract, formatEther, getAddress, JsonRpcProvider, Wallet, ZeroAddress, type InterfaceAbi } from "ethers";

type PublicationManifest = {
  title: string;
  creator: string;
  agent: {
    workflowHash: string;
  };
};

type Deployment = {
  address: string;
  abi: InterfaceAbi;
};

const LOCAL_CHAIN_ID = 31337n;
const LOCAL_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const NETWORKS = {
  default: {
    chainId: LOCAL_CHAIN_ID,
    rpcUrl: "http://127.0.0.1:8545",
  },
  baseSepolia: {
    chainId: 84532n,
    rpcUrl: "https://sepolia.base.org",
  },
} as const;

const currentFilePath = fileURLToPath(import.meta.url);
const hardhatRoot = join(dirname(currentFilePath), "..");
const repoRoot = join(hardhatRoot, "..", "..", "..");
loadEnv({ path: join(hardhatRoot, ".env"), quiet: true });

const publicationRoot = join(repoRoot, "dapp", "publications", "latest");
const publicationPath = join(publicationRoot, "publication.json");
const deploymentNetwork = process.env.DEPLOYMENT_NETWORK || "default";
const networkConfig = NETWORKS[deploymentNetwork as keyof typeof NETWORKS];
const deploymentPath = join(hardhatRoot, "deployments", deploymentNetwork, "WeekoPublication.json");
const dappReceiptPath = join(repoRoot, "dapp", "packages", "nextjs", "public", "chain-receipt.json");

if (!networkConfig) {
  throw new Error(`Unsupported DEPLOYMENT_NETWORK "${deploymentNetwork}". Use "default" or "baseSepolia".`);
}

if (!existsSync(publicationPath)) {
  throw new Error("Publication manifest missing. Run `bun run dapp:manifest` first.");
}

if (!existsSync(deploymentPath)) {
  throw new Error(
    `Contract deployment missing for ${deploymentNetwork}. Run \`bun run dapp:deploy:base-sepolia\` first.`,
  );
}

const publication = JSON.parse(readFileSync(publicationPath, "utf8")) as PublicationManifest;
const deployment = JSON.parse(readFileSync(deploymentPath, "utf8")) as Deployment;
const rpcUrl = process.env.RPC_URL || networkConfig.rpcUrl;
const provider = new JsonRpcProvider(rpcUrl);
const network = await provider.getNetwork();

if (network.chainId !== networkConfig.chainId) {
  throw new Error(
    `RPC chain ID ${network.chainId.toString()} does not match ${deploymentNetwork} (${networkConfig.chainId.toString()}).`,
  );
}

async function getPublisherWallet() {
  const configuredPrivateKey = process.env.PUBLISHER_PRIVATE_KEY;
  if (configuredPrivateKey) {
    return new Wallet(configuredPrivateKey, provider);
  }

  if (network.chainId === LOCAL_CHAIN_ID) {
    return new Wallet(LOCAL_PRIVATE_KEY, provider);
  }

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;
  if (!encryptedKey) {
    throw new Error(
      "No publisher account configured. Run `cd dapp && corepack yarn account:import`; do not put a raw private key in the repository.",
    );
  }

  const passphrase = await password({ message: "Enter password to decrypt publisher private key:" });
  const decryptedWallet = await Wallet.fromEncryptedJson(encryptedKey, passphrase);
  return decryptedWallet.connect(provider);
}

const wallet = await getPublisherWallet();
const walletBalance = await provider.getBalance(wallet.address);
const contract = new Contract(deployment.address, deployment.abi, wallet);
const contentURI =
  process.env.CONTENT_URI || `ipfs://local/${publication.agent.workflowHash.replace(/^0x/, "")}/publication.json`;

if (network.chainId !== LOCAL_CHAIN_ID) {
  if (!process.env.CONTENT_URI || contentURI.includes("replace-with") || contentURI.startsWith("ipfs://local/")) {
    throw new Error("CONTENT_URI must point to the uploaded publication.json for a testnet publication.");
  }
  if (!publication.creator || getAddress(publication.creator) === ZeroAddress) {
    throw new Error("publication.json creator is unset. Rebuild it with CREATOR_ADDRESS set to the publisher address.");
  }
  if (getAddress(publication.creator) !== wallet.address) {
    throw new Error(`publication.json creator ${publication.creator} does not match publisher ${wallet.address}.`);
  }
  if (walletBalance === 0n) {
    throw new Error(`Publisher ${wallet.address} has no ETH on ${deploymentNetwork}.`);
  }
}

console.log(`Network: ${deploymentNetwork} (${network.chainId.toString()})`);
console.log(`Publisher: ${wallet.address}`);
console.log(`Balance: ${formatEther(walletBalance)} ETH`);
console.log(`Contract: ${deployment.address}`);
console.log(`Content URI: ${contentURI}`);
console.log(`Workflow hash: ${publication.agent.workflowHash}`);

if (process.env.PUBLISH_PREFLIGHT === "true") {
  console.log("Preflight complete. No transaction was sent.");
  process.exit(0);
}

const publicationId = (await contract.nextPublicationId()) as bigint;
const publishTransaction = await contract.publish(publication.title, contentURI, publication.agent.workflowHash);
const publishReceipt = await publishTransaction.wait();

const tokenId = (await contract.nextTokenId()) as bigint;
const mintPrice = (await contract.mintPrice()) as bigint;
const mintTransaction = await contract.mint(publicationId, { value: mintPrice });
const mintReceipt = await mintTransaction.wait();

const receipt = {
  schema: "weeko-chain-receipt@0.1.0",
  createdAt: new Date().toISOString(),
  chainId: network.chainId.toString(),
  rpcUrl,
  contractAddress: deployment.address,
  creator: wallet.address,
  collector: wallet.address,
  publicationId: publicationId.toString(),
  tokenId: tokenId.toString(),
  contentURI,
  workflowHash: publication.agent.workflowHash,
  publishTxHash: publishReceipt?.hash || publishTransaction.hash,
  publishBlockNumber: publishReceipt?.blockNumber,
  mintTxHash: mintReceipt?.hash || mintTransaction.hash,
  mintBlockNumber: mintReceipt?.blockNumber,
};

mkdirSync(publicationRoot, { recursive: true });
const serializedReceipt = `${JSON.stringify(receipt, null, 2)}\n`;
const networkReceiptPath = join(publicationRoot, `chain-receipt.${deploymentNetwork}.json`);
const receiptPath = join(publicationRoot, "chain-receipt.json");
writeFileSync(networkReceiptPath, serializedReceipt);
writeFileSync(receiptPath, serializedReceipt);
writeFileSync(dappReceiptPath, serializedReceipt);

console.log(`Publication #${receipt.publicationId} published and token #${receipt.tokenId} minted.`);
console.log(`Receipt written to ${relative(repoRoot, networkReceiptPath)}`);
console.log(`Publish transaction: ${receipt.publishTxHash}`);
console.log(`Mint transaction: ${receipt.mintTxHash}`);
