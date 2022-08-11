import { useState, useEffect } from "react";

function App() {
  const [account, setAccount] = useState(null);

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
    requestAccounts().then(setAccount).catch(console.error);
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
    </div>
  );
}

export default App;
