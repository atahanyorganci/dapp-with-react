const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const AtaToken = await hre.ethers.getContractFactory("AtaToken");
  const ataToken = await AtaToken.deploy();

  await ataToken.deployed();
  console.log(`Deployed AtaToken at ${ataToken.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
