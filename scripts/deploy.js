// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { root } = require("../merkleTree.js");

async function main() {
  const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
  const nFTCollection = await NFTCollection.deploy(
    "NFTree",
    "MerkleTree",
    root
  );
  await nFTCollection.deployed();

  console.log("Contract deployed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
