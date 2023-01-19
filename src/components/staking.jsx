import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { DUMMY_TOKEN, provider, STAKING_CONTRACT } from "../web3";

const getStakingViews = async account => {
    const signer = provider.getSigner(account);
    const staking = STAKING_CONTRACT.connect(signer);
    const [staked, reward, totalStaked] = await Promise.all([
        staking.stakedOf(account),
        staking.rewardOf(account),
        staking.totalStaked(),
    ]);
    return {
        staked: ethers.utils.formatEther(staked),
        reward: ethers.utils.formatEther(reward),
        totalStaked: ethers.utils.formatEther(totalStaked),
    };
};

const Staking = ({ account }) => {
    const [views, setViews] = useState({});
    const [stake, setStake] = useState("");
    const [withdraw, setWithdraw] = useState("");

    const handleStake = async event => {
        event.preventDefault();
        const signer = provider.getSigner(account);
        const amount = ethers.utils.parseEther(stake);

        const dummyToken = DUMMY_TOKEN.connect(signer);
        const allowance = await dummyToken.allowance(
            account,
            STAKING_CONTRACT.address
        );
        if (allowance.lt(amount)) {
            const tx = await dummyToken.approve(
                STAKING_CONTRACT.address,
                amount
            );
            await tx.wait();
        }

        const staking = STAKING_CONTRACT.connect(signer);

        const tx = await staking.stake(amount);
        await tx.wait();
    };

    const handleWithdraw = async event => {
        event.preventDefault();
        const signer = provider.getSigner(account);
        const staking = STAKING_CONTRACT.connect(signer);

        const amount = ethers.utils.parseEther(withdraw);
        const tx = await staking.withdraw(amount);
        await tx.wait();
    };

    const handleClaimReward = async () => {
        const signer = provider.getSigner(account);
        const staking = STAKING_CONTRACT.connect(signer);

        const tx = await staking.claimReward();
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
                <strong>Staked: </strong> {views.staked} DT
            </p>
            <p>
                <strong>Reward: </strong> {views.reward} DT
            </p>
            <p>
                <strong>Total Staked: </strong> {views.totalStaked} DT
            </p>
            <div style={{ display: "flex" }}>
                <form onSubmit={handleStake}>
                    <label htmlFor="stake">Stake</label>
                    <input
                        id="stake"
                        placeholder="0.0 DT"
                        value={stake}
                        onChange={e => setStake(e.target.value)}
                    />
                    <button type="submit">Stake DT</button>
                </form>
                <form onSubmit={handleWithdraw}>
                    <label htmlFor="withdraw">Withdraw</label>
                    <input
                        id="withdraw"
                        placeholder="0.0 DT"
                        value={withdraw}
                        onChange={e => setWithdraw(e.target.value)}
                    />
                    <button type="submit">Withdraw DT</button>
                </form>
            </div>
            <button onClick={handleClaimReward}>Claim Reward</button>
        </div>
    );
};

export default Staking;
