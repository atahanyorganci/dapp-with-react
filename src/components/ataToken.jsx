import { ethers } from "ethers";
import { useState, useEffect } from "react";
import AtaTokenABI from "../../abi/ataToken.abi.json";

const ATA_TOKEN_ADDRESS = "0x47741C56064B4c129d585CEe9A9d3A3dB7CDA9ce";
const ATA_TOKEN = new ethers.Contract(ATA_TOKEN_ADDRESS, AtaTokenABI);

const getBalanceAndClaimed = async (account, provider) => {
  const ataToken = ATA_TOKEN.connect(provider);
  const [balance, claimed] = await Promise.all([
    ataToken.balanceOf(account),
    ataToken.hasClaimed(account),
  ]);
  return [ethers.utils.formatEther(balance), claimed];
};

const AtaToken = ({ account, provider }) => {
  const [balance, setBalance] = useState("");
  const [claimed, setClaimed] = useState(false);

  const claim = async () => {
    const signer = provider.getSigner();
    const ataToken = ATA_TOKEN.connect(signer);
    const tx = await ataToken.claim({
      gasLimit: 1_000_000,
    });
    const receipt = await tx.wait();
    console.log(receipt);

    getBalanceAndClaimed(account, provider)
      .then(([balance, claimed]) => {
        setBalance(balance);
        setClaimed(claimed);
      })
      .catch(console.error);
  };

  useEffect(() => {
    getBalanceAndClaimed(account, provider)
      .then(([balance, claimed]) => {
        setBalance(balance);
        setClaimed(claimed);
      })
      .catch(console.error);
  }, [provider, account]);

  return (
    <div>
      <p>AtaToken balance: {balance} ATA</p>
      {claimed ? (
        <p>You have already claimed your ATA</p>
      ) : (
        <button onClick={claim}>Claim ATA</button>
      )}
    </div>
  );
};

export default AtaToken;
