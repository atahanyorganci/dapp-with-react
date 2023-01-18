import { ethers } from "ethers";
import { useEffect, useState } from "react";
import DummyToken from "./components/dummyToken";
import Staking from "./components/staking";

const Balance = ({ provider, account }) => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      const balance = await provider.getBalance(account);
      return ethers.utils.formatEther(balance);
    };
    getBalance().then(setBalance).catch(console.error);
  }, [account, provider]);

  if (!balance) {
    return <p>Loading...</p>;
  }
  return <p>Balance: {balance} tBNB</p>;
};

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const checkAccounts = async () => {
    if (!window.ethereum) {
      return null;
    }
    const [account] = await window.ethereum.request({
      method: "eth_accounts",
    });
    window.ethereum.on("accountsChanged", accounts => {
      setAccount(accounts[0]);
    });
    return account;
  };

  const requestAccounts = async () => {
    if (!window.ethereum) {
      return null;
    }
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return account;
  };

  useEffect(() => {
    checkAccounts().then(setAccount).catch(console.error);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  return (
    <div>
      <h1>dApp with React</h1>
      {account ? (
        <p>
          Account: <code style={{ display: "inline" }}>{account}</code>
        </p>
      ) : (
        <button onClick={() => requestAccounts()}>Request Accounts</button>
      )}
      {provider && account && (
        <>
          <Balance provider={provider} account={account} />
          <DummyToken provider={provider} account={account} />
          <Staking provider={provider} account={account} />
        </>
      )}
    </div>
  );
}

export default App;
