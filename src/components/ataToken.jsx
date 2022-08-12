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

const addAtaTokenToMetaMask = async () => {
  if (!window.ethereum) {
    return false;
  }
  try {
    const added = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: ATA_TOKEN_ADDRESS,
          symbol: "ATA",
          decimals: 18,
          image: "https://ata-token.netlify.app/opn.png",
        },
      },
    });
    return added;
  } catch (error) {
    return false;
  }
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

  if (!balance) {
    return (
      <div>
        <h2>Ata Token</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Ata Token</h2>
      <p>
        <strong>AtaToken balance:</strong> {balance} ATA
      </p>
      {claimed ? (
        <p>You have already claimed your ATA</p>
      ) : (
        <button onClick={claim}>Claim ATA</button>
      )}
      <button onClick={addAtaTokenToMetaMask}>Add to MetaMask</button>
    </div>
  );
};

export default AtaToken;
