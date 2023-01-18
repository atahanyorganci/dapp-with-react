const hre = require("hardhat");

async function main() {
  const dummyTokenBuildInfo = await hre.artifacts.readArtifact("DummyToken");

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

  const StakingVault = await hre.ethers.getContractFactory("StakingVault");
  const stakingVault = await StakingVault.deploy(...constructorArguments);

  await stakingVault.deployed();
  console.log(`Deployed StakingVault at ${stakingVault.address}`);

  const dummyTokenContract = new hre.ethers.Contract(
    tokenAddress,
    dummyTokenBuildInfo.abi,
    deployer
  );

  const tx = await dummyTokenContract.approve(
    stakingVault.address,
    hre.ethers.utils.parseEther("1000000000")
  );
  const receipt = await tx.wait();
  console.log(
    `Approved StakingVault contract tx hash: ${receipt.transactionHash}`
  );

  await hre.run("verify:verify", {
    address: stakingVault.address,
    constructorArguments,
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
