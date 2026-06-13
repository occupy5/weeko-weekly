import { expect } from "chai";
import { parseEther, sha256, toUtf8Bytes, ZeroHash } from "ethers";
import { network } from "hardhat";
import type { Abi_WeekoPublication } from "../generated/abis/WeekoPublication.js";
import { loadAndExecuteDeploymentsFromFiles } from "../rocketh/environment.js";

const { provider, networkHelpers, ethers } = await network.create();

async function deployFixture() {
  const env = await loadAndExecuteDeploymentsFromFiles({ provider });
  const { address, abi } = env.get<Abi_WeekoPublication>("WeekoPublication");
  const weekoPublication = await ethers.getContractAt(abi, address);
  const [deployer, creator, collector] = await ethers.getSigners();

  return { deployer, creator, collector, weekoPublication };
}

describe("WeekoPublication", function () {
  const workflowHash = sha256(toUtf8Bytes("weeko-demo-run-log"));

  it("publishes a content URI", async function () {
    const { creator, weekoPublication } = await networkHelpers.loadFixture(deployFixture);

    await expect(weekoPublication.connect(creator).publish("Weeko Mint Demo", "ipfs://weeko-demo", workflowHash))
      .to.emit(weekoPublication, "PublicationPublished")
      .withArgs(1, creator.address, "Weeko Mint Demo", "ipfs://weeko-demo", workflowHash);

    const publication = await weekoPublication.publications(1);
    expect(publication.creator).to.equal(creator.address);
    expect(publication.title).to.equal("Weeko Mint Demo");
    expect(publication.contentURI).to.equal("ipfs://weeko-demo");
    expect(publication.workflowHash).to.equal(workflowHash);
  });

  it("rejects an empty workflow hash", async function () {
    const { creator, weekoPublication } = await networkHelpers.loadFixture(deployFixture);

    await expect(
      weekoPublication.connect(creator).publish("Weeko Mint Demo", "ipfs://weeko-demo", ZeroHash),
    ).to.be.revertedWith("Workflow hash required");
  });

  it("mints a collectible for a publication", async function () {
    const { collector, creator, weekoPublication } = await networkHelpers.loadFixture(deployFixture);

    await weekoPublication.connect(creator).publish("Weeko Mint Demo", "ipfs://weeko-demo", workflowHash);
    await expect(weekoPublication.connect(collector).mint(1))
      .to.emit(weekoPublication, "PublicationMinted")
      .withArgs(1, 1, collector.address, "ipfs://weeko-demo");

    expect(await weekoPublication.ownerOf(1)).to.equal(collector.address);
    expect(await weekoPublication.tokenURI(1)).to.equal("ipfs://weeko-demo");
    expect(await weekoPublication.tokenPublication(1)).to.equal(1);
  });

  it("allows the owner to set a mint price", async function () {
    const { collector, creator, weekoPublication } = await networkHelpers.loadFixture(deployFixture);

    await weekoPublication.setMintPrice(parseEther("0.01"));
    await weekoPublication.connect(creator).publish("Paid Demo", "ipfs://paid-demo", workflowHash);

    await expect(weekoPublication.connect(collector).mint(1)).to.be.revertedWith("Insufficient mint price");
    await weekoPublication.connect(collector).mint(1, { value: parseEther("0.01") });

    expect(await weekoPublication.ownerOf(1)).to.equal(collector.address);
  });
});
