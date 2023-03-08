const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = require("keccak256");

describe("NFT Collection Whitelist using Merkle Tree", function () {
  it("allow only whitelisted accounts to mint", async () => {
    const accounts = await hre.ethers.getSigners();
    const whitelisted = accounts.slice(0, 5);
    const notWhitelisted = accounts.slice(5, 10);

    const padBuffer = (addr) => {
      return Buffer.from(addr.substr(2).padStart(32 * 2, 0), "hex");
    };

    const leaves = whitelisted.map((account) => padBuffer(account.address));
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    const merkleRoot = tree.getHexRoot();

    const NFTContract = await ethers.getContractFactory("NFTCollection");
    const nFTContract = await NFTContract.deploy(
      "NFTree",
      "MerkleTree",
      merkleRoot
    );
    await nFTContract.deployed();

    const merkleProof = tree.getHexProof(padBuffer(whitelisted[0].address));
    const invalidMerkleProof = tree.getHexProof(
      padBuffer(notWhitelisted[0].address)
    );

    await expect(nFTContract.mint(merkleProof, 10)).to.be.reverted;
    await expect(
      nFTContract.connect(notWhitelisted[0]).mint(invalidMerkleProof, 10)
    ).to.be.reverted;
  });
});
