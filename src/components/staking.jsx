import { ethers } from "ethers";
import { useEffect, useState } from "react";
import StakingAbi from "../../abi/staking.abi.json";

const STAKING_ADDRESS = "0x2Fea511D355e7A6f8A1F9BE566025a19762B9138";
const STAKING_CONTRACT = new ethers.Contract(STAKING_ADDRESS, StakingAbi);

const getStakingViews = async (account, provider) => {
  const signer = provider.getSigner(account);
  const staking = STAKING_CONTRACT.connect(signer);
  const [staked, reward, totalStaked] = await Promise.all([
    staking.getStaked(),
    staking.getReward(),
    staking.getTotalStaked(),
  ]);
  return {
    staked: ethers.utils.formatEther(staked),
    reward: ethers.utils.formatEther(reward),
    totalStaked: ethers.utils.formatEther(totalStaked),
  };
};

const Staking = ({ account, provider }) => {
  const [views, setViews] = useState({});
  const [stake, setStake] = useState("");
  const [withdraw, setWithdraw] = useState("");

  const handleStake = async event => {
    event.preventDefault();
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);

    const tx = await staking.stake(ethers.utils.parseEther(stake), {
      gasLimit: 1_000_000,
    });
    await tx.wait();
  };

  const handleWithdraw = async event => {
    event.preventDefault();
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);

    const tx = await staking.withdraw(ethers.utils.parseEther(withdraw), {
      gasLimit: 1_000_000,
    });
    await tx.wait();
  };

  useEffect(() => {
    getStakingViews(account, provider).then(setViews).catch(console.error);
  }, [account, provider]);

  if (!views.staked) {
    return (
      <div>
        <h2>Staking</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Staking</h2>
      <p>
        <strong>Staked: </strong> {views.staked} ATA
      </p>
      <p>
        <strong>Reward: </strong> {views.reward} ATA
      </p>
      <p>
        <strong>Total Staked: </strong> {views.totalStaked} ATA
      </p>
      <div style={{ display: "flex" }}>
        <form onSubmit={handleStake}>
          <label htmlFor="stake">Stake</label>
          <input
            id="stake"
            placeholder="0.0 ATA"
            value={stake}
            onChange={e => setStake(e.target.value)}
          />
          <button type="submit">Stake ATA</button>
        </form>
        <form onSubmit={handleWithdraw}>
          <label htmlFor="withdraw">Withdraw</label>
          <input
            id="withdraw"
            placeholder="0.0 ATA"
            value={withdraw}
            onChange={e => setWithdraw(e.target.value)}
          />
          <button type="submit">Withdraw ATA</button>
        </form>
      </div>
    </div>
  );
};

export default Staking;
