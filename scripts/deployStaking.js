const hre = require("hardhat");

async function main() {
  const ataTokenBuildInfo = await hre.artifacts.readArtifact("AtaToken");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);

  const [_node, _script, tokenAddress, rewardRate] = process.argv;
  console.log(`Token address: ${tokenAddress}`);
  console.log(`Reward rate: ${rewardRate}`);

  if (!_node || !_script || !tokenAddress || !rewardRate) {
    throw new Error("Usage: node deployStaking.js <tokenAddress> <rewardRate>");
  }
  const constructorArguments = [
    tokenAddress,
    deployer.address,
    hre.ethers.utils.parseEther(rewardRate),
  ];

  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(...constructorArguments);

  await staking.deployed();
  console.log(`Deployed Staking at ${staking.address}`);

  const ataTokenContract = new hre.ethers.Contract(
    tokenAddress,
    ataTokenBuildInfo.abi,
    deployer
  );

  const tx = await ataTokenContract.approve(
    staking.address,
    hre.ethers.utils.parseEther("1000000000")
  );
  const receipt = await tx.wait();
  console.log(`Approved Staking contract tx hash: ${receipt.transactionHash}`);

  await hre.run("verify:verify", {
    address: staking.address,
    constructorArguments,
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
