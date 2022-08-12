import { ethers } from "ethers";
import { useState, useEffect } from "react";
import AtaTokenABI from "../../abi/ataToken.abi.json";

const ATA_TOKEN_ADDRESS = "0x47741C56064B4c129d585CEe9A9d3A3dB7CDA9ce";
const ATA_TOKEN = new ethers.Contract(ATA_TOKEN_ADDRESS, AtaTokenABI);

const AtaToken = ({ account, provider }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      const ataToken = ATA_TOKEN.connect(provider);
      const balance = await ataToken.balanceOf(account);
      return ethers.utils.formatEther(balance);
    };
    getBalance().then(setBalance).catch(console.error);
  }, [provider, account]);

  return (
    <div>
      <p>AtaToken balance: {balance} ATA</p>
    </div>
  );
};

export default AtaToken;
