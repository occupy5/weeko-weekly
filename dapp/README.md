# Weeko Proof

Optional provenance and publishing extension for Weeko. The main project focuses on the Agent content-production workflow; this workspace adds IPFS packaging, public verification, and collectible creation proofs.

The extension is intentionally small:

- `WeekoPublication.sol` registers a final content URI and the SHA-256 fingerprint of the Agent run log.
- The same contract mints an ERC-721 collectible proof for a publication.
- The Next.js app displays the Agent timeline and turns the verified workflow into a Creation Receipt.
- `publication:manifest` packages the current Weeko issue and prints the `workflowHash` used by the publish transaction.
- `publication:publish-local` publishes the manifest and mints one proof NFT on the local Hardhat chain.

## Structure

```txt
dapp/
├── packages/
│   ├── hardhat/
│   │   ├── contracts/WeekoPublication.sol
│   │   ├── deploy/00_deploy_weeko_publication.ts
│   │   ├── scripts/buildPublicationManifest.ts
│   │   ├── scripts/publishLatestPublication.ts
│   │   └── test/WeekoPublication.ts
│   └── nextjs/
│       └── app/page.tsx
└── publications/latest/
```

## Local demo

From the repository root:

```bash
bun run dapp:manifest
bun run dapp:chain
bun run dapp:deploy
bun run dapp:publish-latest
bun run dapp
```

Open the dApp at `http://localhost:3000`.

`dapp:publish-latest` is deliberately restricted: its built-in test key only works when the RPC reports chain ID `31337`. Other networks require `PUBLISHER_PRIVATE_KEY` and an explicit `CONTENT_URI`.

For the contract tests:

```bash
bun run dapp:test
```

## Testnet deployment

1. Configure `dapp/packages/hardhat/.env`.
2. Generate or import a deployer:

```bash
yarn --cwd dapp generate
yarn --cwd dapp account:import
```

3. Deploy to a supported testnet:

```bash
yarn --cwd dapp deploy --network baseSepolia
```

4. Upload `publication.json` and `run-log.json`, then set the returned URI as `CONTENT_URI`.
5. Run the publish script with a user-controlled key and RPC, or publish interactively in the dapp.
6. Mint the resulting publication ID as the collectible proof.

## Workflow proof

The run log remains off-chain so it can contain detailed steps, tool calls, repairs, and safety boundaries. Before publishing, the manifest script hashes the exact `run-log.json` bytes with SHA-256:

```txt
run-log.json
  -> SHA-256
  -> workflowHash (bytes32)
  -> WeekoPublication.publish(title, contentURI, workflowHash)
```

Any later change to the run log produces a different hash. This lets the Creation Receipt prove which Agent process belongs to the on-chain publication without storing the full log on-chain.

## Demo proof checklist

- Contract address
- Publish transaction hash
- Mint transaction hash
- IPFS CID for `publication.json`
- Agent run log CID or generated local `publications/latest/run-log.json`
- Screenshot or screen recording of the dApp

## Safety boundaries

- Production wallet signing uses an explicit user-controlled key or the interactive dapp.
- The bundled Hardhat test key is rejected on every chain except local chain ID `31337`.
- Private keys are never written to `publication.json`.
- The MVP does not implement DAO voting, revenue splitting, token gating, or secondary-market logic.
- IPFS upload is service-dependent and can be repeated without changing the content hash if the files stay unchanged.
