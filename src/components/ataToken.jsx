import { ethers } from "ethers";
import { useState, useEffect } from "react";
import AtaTokenABI from "../../abi/ataToken.abi.json";

const ATA_TOKEN_ADDRESS = "0x47741C56064B4c129d585CEe9A9d3A3dB7CDA9ce";
const ATA_TOKEN = new ethers.Contract(ATA_TOKEN_ADDRESS, AtaTokenABI);

const AtaToken = ({ account, provider }) => {
  const [balance, setBalance] = useState("");
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const getBalanceAndClaimed = async () => {
      const ataToken = ATA_TOKEN.connect(provider);
      const [balance, claimed] = await Promise.all([
        ataToken.balanceOf(account),
        ataToken.hasClaimed(account),
      ]);
      return [ethers.utils.formatEther(balance), claimed];
    };

    getBalanceAndClaimed()
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
        <button>Claim ATA</button>
      )}
    </div>
  );
};

export default AtaToken;
