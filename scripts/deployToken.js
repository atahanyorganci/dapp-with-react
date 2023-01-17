const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const dummyToken = await DummyToken.deploy();

  await dummyToken.deployed();
  console.log(`Deployed DummyToken at ${dummyToken.address}`);

  await hre.run("verify:verify", {
    address: dummyToken.address,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
