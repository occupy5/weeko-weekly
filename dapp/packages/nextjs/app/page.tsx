"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "@scaffold-ui/components";
import { Button, Card, Cursor, Divider, Input } from "animal-island-ui";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  ArrowUpRightIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import {
  useDeployedContractInfo,
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTargetNetwork,
} from "~~/hooks/scaffold-eth";

type TimelineStep = {
  detail: string;
  id?: string;
  label: string;
  status: "completed" | "failed" | "in_progress" | "pending" | "repaired" | "skipped";
};

type ProofSnapshot = {
  agent?: {
    model?: string;
    metrics?: {
      iterations?: number;
      slideCount?: number;
      toolCalls?: number;
    };
    workflow?: TimelineStep[];
    workflowHash?: string;
  };
  title?: string;
};

type ChainReceipt = {
  contentURI?: string;
  mintTxHash?: string;
  publicationId?: string;
  publishTxHash?: string;
  tokenId?: string;
  workflowHash?: string;
};

const DEFAULT_CONTENT_URI = "ipfs://replace-with-publication-json-cid";
const bytes32Pattern = /^0x[0-9a-fA-F]{64}$/;

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContract } = useDeployedContractInfo({ contractName: "WeekoPublication" });

  const [title, setTitle] = useState("");
  const [contentURI, setContentURI] = useState(DEFAULT_CONTENT_URI);
  const [workflowHash, setWorkflowHash] = useState("");
  const [publicationIdToMint, setPublicationIdToMint] = useState("");
  const [lastTxHash, setLastTxHash] = useState<string>();
  const [chainReceipt, setChainReceipt] = useState<ChainReceipt>();
  const [proof, setProof] = useState<ProofSnapshot>();
  const [proofLoadFailed, setProofLoadFailed] = useState(false);

  useEffect(() => {
    const loadProofSnapshot = async () => {
      const response = await fetch("/weeko-proof.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`Proof snapshot request failed with ${response.status}`);

      const nextProof = (await response.json()) as ProofSnapshot;
      setProof(nextProof);
      if (nextProof.title) setTitle(nextProof.title);
      if (nextProof.agent?.workflowHash && bytes32Pattern.test(nextProof.agent.workflowHash)) {
        setWorkflowHash(nextProof.agent.workflowHash);
      }
    };

    loadProofSnapshot().catch(() => setProofLoadFailed(true));

    fetch("/chain-receipt.json", { cache: "no-store" })
      .then(response => (response.ok ? (response.json() as Promise<ChainReceipt>) : undefined))
      .then(receipt => {
        if (!receipt) return;
        setChainReceipt(receipt);
      })
      .catch(() => undefined);
  }, []);

  const { data: nextPublicationId } = useScaffoldReadContract({
    contractName: "WeekoPublication",
    functionName: "nextPublicationId",
  });
  const { data: mintPrice } = useScaffoldReadContract({
    contractName: "WeekoPublication",
    functionName: "mintPrice",
  });
  const { data: collectorBalance } = useScaffoldReadContract({
    contractName: "WeekoPublication",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const latestPublicationId = useMemo(() => {
    if (!nextPublicationId || nextPublicationId <= 1n) return undefined;
    return nextPublicationId - 1n;
  }, [nextPublicationId]);

  const { data: latestPublication } = useScaffoldReadContract({
    contractName: "WeekoPublication",
    functionName: "publications",
    args: [latestPublicationId],
  });

  useEffect(() => {
    const onChainContentURI = latestPublication?.[2];
    if (onChainContentURI) setContentURI(onChainContentURI);
  }, [latestPublication]);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "WeekoPublication" });
  const isWorkflowHashValid = bytes32Pattern.test(workflowHash);
  const onChainCreator = latestPublication?.[0];
  const onChainWorkflowHash = typeof latestPublication?.[3] === "string" ? latestPublication[3] : undefined;
  const isCurrentPublicationOnChain =
    Boolean(onChainWorkflowHash) &&
    Boolean(workflowHash) &&
    onChainWorkflowHash?.toLowerCase() === workflowHash.toLowerCase();
  const matchingChainReceipt =
    chainReceipt?.workflowHash?.toLowerCase() === workflowHash.toLowerCase() ? chainReceipt : undefined;
  const collectedByWallet = BigInt(collectorBalance?.toString() || "0");
  const receiptHash = isCurrentPublicationOnChain ? onChainWorkflowHash || workflowHash : workflowHash;
  const receiptTitle = isCurrentPublicationOnChain ? latestPublication?.[1] || title : title;
  const timeline = proof?.agent?.workflow ?? [];
  const proofMetrics = proof?.agent?.metrics;
  const displayedLastTxHash =
    lastTxHash || matchingChainReceipt?.mintTxHash || matchingChainReceipt?.publishTxHash || "Waiting for publication";

  useEffect(() => {
    if (isCurrentPublicationOnChain && latestPublicationId) {
      setPublicationIdToMint(latestPublicationId.toString());
      return;
    }
    if (matchingChainReceipt?.publicationId) {
      setPublicationIdToMint(matchingChainReceipt.publicationId);
    }
  }, [isCurrentPublicationOnChain, latestPublicationId, matchingChainReceipt]);

  useEffect(() => {
    if (!isCurrentPublicationOnChain && matchingChainReceipt?.contentURI) {
      setContentURI(matchingChainReceipt.contentURI);
    }
  }, [isCurrentPublicationOnChain, matchingChainReceipt]);

  const publish = async () => {
    if (!isWorkflowHashValid || !title.trim()) return;

    const txHash = await writeContractAsync({
      functionName: "publish",
      args: [title, contentURI, workflowHash as `0x${string}`],
    });
    setLastTxHash(txHash);
  };

  const mint = async () => {
    if (!publicationIdToMint) return;
    const parsedPublicationId = BigInt(publicationIdToMint || "0");
    const txHash = await writeContractAsync({
      functionName: "mint",
      args: [parsedPublicationId],
      value: mintPrice,
    });
    setLastTxHash(txHash);
  };

  return (
    <main className="creation-studio grow">
      <Cursor className="island-cursor">
        <div className="island-sky" aria-hidden="true">
          <span className="cloud cloud-one" />
          <span className="cloud cloud-two" />
        </div>

        <section className="island-page">
          <header className="island-hero">
            <div className="hero-copy">
              <span className="hero-kicker">WEEKO PROOF · ISLAND CREATOR DESK</span>
              <h1>记录知识如何被创造</h1>
              <p>从研究、写作到发布，为 Agent 创作过程留下可信记录。</p>
            </div>
            <div className="hero-actions">
              <div className="publication-status">
                <span className={`status-dot ${latestPublicationId ? "status-dot-verified" : ""}`} />
                <span>
                  {isCurrentPublicationOnChain && latestPublicationId
                    ? `Publication #${latestPublicationId}`
                    : "Ready to publish"}
                </span>
              </div>
              <WalletButton />
            </div>
          </header>

          <Divider type="wave-yellow" className="hero-divider" />

          <div className="island-workspace">
            <div className="island-main-column">
              <section className="island-section">
                <SectionHeading color="app-green" eyebrow="01 · Prepare proof">
                  Publication desk
                </SectionHeading>

                <Card className="island-panel publication-panel">
                  <div className="field-grid">
                    <Field label="Publication title">
                      <Input
                        allowClear
                        aria-label="Publication title"
                        size="large"
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                      />
                    </Field>

                    <Field label="Content URI">
                      <Input
                        allowClear
                        aria-label="Content URI"
                        className="technical-input"
                        size="large"
                        value={contentURI}
                        onChange={event => setContentURI(event.target.value)}
                      />
                    </Field>

                    <Field label="Workflow hash" hint="Generate with bun run dapp:manifest">
                      <Input
                        allowClear
                        aria-invalid={!isWorkflowHashValid}
                        aria-label="Workflow hash"
                        className="technical-input"
                        size="large"
                        status={isWorkflowHashValid ? undefined : "error"}
                        value={workflowHash}
                        onChange={event => setWorkflowHash(event.target.value)}
                      />
                    </Field>
                  </div>

                  <Divider type="line-teal" className="panel-divider" />

                  <div className="publish-action">
                    <Button
                      icon={<ArrowUpRightIcon className="h-5 w-5" />}
                      loading={isMining}
                      disabled={!isWorkflowHashValid || !title.trim()}
                      size="large"
                      type="primary"
                      onClick={publish}
                    >
                      Publish creation proof
                    </Button>
                    <span>One wallet confirmation</span>
                  </div>
                </Card>
              </section>

              <section className="island-section">
                <SectionHeading color="app-blue" eyebrow="Live contract state">
                  Chain evidence
                </SectionHeading>

                <Card className="island-panel evidence-panel">
                  <div className="evidence-grid">
                    <Evidence label="Creator">
                      <Address address={onChainCreator || connectedAddress} chain={targetNetwork} />
                    </Evidence>
                    <Evidence label="Contract">
                      {deployedContract ? (
                        <Address address={deployedContract.address} chain={targetNetwork} />
                      ) : (
                        <span className="evidence-warning">Deploy contract first</span>
                      )}
                    </Evidence>
                    <Evidence label="Mint price">
                      {mintPrice !== undefined ? `${formatEther(mintPrice)} ETH` : "Unknown"}
                    </Evidence>
                    <Evidence label="Last transaction">
                      <span className="transaction-value">{displayedLastTxHash}</span>
                    </Evidence>
                  </div>
                </Card>
              </section>

              <section className="island-section">
                <SectionHeading color="app-orange" eyebrow="02 · Verify process">
                  Agent field notes
                </SectionHeading>

                <Card className="island-panel timeline-panel">
                  <div className="creation-timeline">
                    {timeline.length > 0 ? (
                      timeline.map((step, index) => (
                        <TimelineItem index={index + 1} key={step.id || `${step.label}-${index}`} step={step} />
                      ))
                    ) : (
                      <p className="timeline-empty">
                        {proofLoadFailed ? "Unable to load the workflow proof." : "Loading workflow proof..."}
                      </p>
                    )}
                  </div>

                  <Card className="hash-note" color="app-teal">
                    <FingerPrintIcon className="hash-note-icon" />
                    <div>
                      <strong>Why the hash matters</strong>
                      <p>
                        Changing one character in the run log produces a different fingerprint, tying this exact
                        creative process to the publication.
                      </p>
                    </div>
                  </Card>
                </Card>
              </section>
            </div>

            <aside className="receipt-column">
              <SectionHeading color="app-yellow" eyebrow="03 · Collect proof">
                Creation receipt
              </SectionHeading>

              <Card className="creation-receipt" color="app-yellow">
                <div className="receipt-header">
                  <div>
                    <p>WEEKO PROOF</p>
                    <strong>
                      #
                      {isCurrentPublicationOnChain && latestPublicationId
                        ? latestPublicationId.toString().padStart(3, "0")
                        : "PREVIEW"}
                    </strong>
                  </div>
                  <DocumentCheckIcon />
                </div>

                <div className="receipt-title">{receiptTitle}</div>

                <dl className="receipt-details">
                  <ReceiptRow label="Agent" value={formatModelName(proof?.agent?.model)} />
                  <ReceiptRow label="Steps" value={formatMetric(proof ? timeline.length : undefined, Boolean(proof))} />
                  <ReceiptRow label="Iterations" value={formatMetric(proofMetrics?.iterations, Boolean(proof))} />
                  <ReceiptRow label="Tool calls" value={formatMetric(proofMetrics?.toolCalls, Boolean(proof))} />
                  <ReceiptRow label="Status" value={isCurrentPublicationOnChain ? "Verified on-chain" : "Preview"} />
                  <ReceiptRow
                    label="Token"
                    value={matchingChainReceipt?.tokenId ? `#${matchingChainReceipt.tokenId}` : "Not minted"}
                  />
                  <ReceiptRow label="Collected" value={collectedByWallet.toString()} />
                </dl>

                <div className="receipt-hash">
                  <span>WORKFLOW SHA-256</span>
                  <code>{shortHash(receiptHash)}</code>
                </div>

                <div className={`receipt-stamp ${isCurrentPublicationOnChain ? "is-verified" : ""}`}>
                  {isCurrentPublicationOnChain ? <CheckCircleIcon /> : <FingerPrintIcon />}
                  {isCurrentPublicationOnChain ? "PROCESS VERIFIED" : "READY TO VERIFY"}
                </div>
              </Card>

              <Card className="mint-panel">
                <Field label="Publication to collect">
                  <Input
                    aria-label="Publication ID to mint"
                    inputMode="numeric"
                    size="large"
                    value={publicationIdToMint}
                    onChange={event => setPublicationIdToMint(event.target.value)}
                    placeholder="Publication ID"
                  />
                </Field>
                <Button
                  block
                  disabled={mintPrice === undefined || !publicationIdToMint}
                  loading={isMining}
                  size="large"
                  type="primary"
                  onClick={mint}
                >
                  {mintPrice === undefined ? "Loading mint price" : `Collect proof · ${formatEther(mintPrice)} ETH`}
                </Button>
              </Card>
            </aside>
          </div>
        </section>
      </Cursor>
    </main>
  );
};

const SectionHeading = ({
  children,
  color,
  eyebrow,
}: {
  children: React.ReactNode;
  color: "app-blue" | "app-green" | "app-orange" | "app-yellow";
  eyebrow: string;
}) => (
  <div className="section-heading">
    <Card className="section-ribbon" color={color} type="title">
      <h2>{children}</h2>
    </Card>
    <span>{eyebrow}</span>
  </div>
);

const Field = ({ children, hint, label }: { children: React.ReactNode; hint?: string; label: string }) => (
  <label className="island-field">
    <span className="field-heading">
      <strong>{label}</strong>
      {hint && <small>{hint}</small>}
    </span>
    {children}
  </label>
);

const TimelineItem = ({ index, step }: { index: number; step: TimelineStep }) => (
  <div className="timeline-item">
    <div className={`timeline-marker timeline-marker-${step.status}`}>
      {step.status === "repaired" || step.status === "failed" ? (
        <ExclamationTriangleIcon />
      ) : (
        <span>{String(index).padStart(2, "0")}</span>
      )}
    </div>
    <div className="timeline-copy">
      <div>
        <strong>{step.label}</strong>
        {step.status === "repaired" && <WrenchScrewdriverIcon />}
        <span className={`timeline-status timeline-status-${step.status}`}>{formatStatus(step.status)}</span>
      </div>
      <p>{step.detail}</p>
    </div>
  </div>
);

const Evidence = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="evidence-item">
    <span>{label}</span>
    <div>{children}</div>
  </div>
);

const ReceiptRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);

const WalletButton = () => (
  <ConnectButton.Custom>
    {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
      const connected = mounted && account && chain;

      if (!connected) {
        return (
          <Button size="middle" type="primary" onClick={openConnectModal}>
            Connect wallet
          </Button>
        );
      }

      if (chain.unsupported) {
        return (
          <Button danger size="middle" onClick={openChainModal}>
            Switch network
          </Button>
        );
      }

      return (
        <Button size="middle" type="default" onClick={openAccountModal}>
          {account.displayName}
        </Button>
      );
    }}
  </ConnectButton.Custom>
);

const shortHash = (hash: string) => (hash.length > 24 ? `${hash.slice(0, 14)}...${hash.slice(-10)}` : hash);

const formatMetric = (value: number | undefined, proofLoaded: boolean) =>
  value === undefined ? (proofLoaded ? "Unavailable" : "...") : String(value);

const formatModelName = (model: string | undefined) => model?.replace(/\s*\([^)]*\)\s*$/, "") || "Unavailable";

const formatStatus = (status: TimelineStep["status"]) => status.replace("_", " ");

export default Home;
