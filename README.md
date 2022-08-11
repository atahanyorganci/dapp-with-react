# dApp Development with React Workshop

## Initialize React Application with [`vite`][vite]

[`vite`][vite] next generation tooling for building frontend applications. Get started with [`vite`][vite] by running following command.
```bash
npm create vite@latest
```
We can run the development server using `npm run dev` and local server will start will start with automatic reloads!

> You can remove unnecessary markup and CSS that `vite` creates

## Connecting to MetaMask

MetaMask adds a global object `ethereum` that can be used to interact with MetaMask. This object can be accessed by `window.ethereum`.

We can send requests to MetaMask using `window.ethereum.request()` method, we ask the user to connect their account by sending the `eth_requestAccounts` request. Details of this request can be found in [MetaMask's documentation](https://docs.metamask.io/guide/rpc-api.html#eth-requestaccounts).

```js
const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
});
```

We can use `useEffect` and `useState` hooks to initialize `account` state when the component mounts.

> Providing `[]` (empty array) to dependency section of `useEffect(func, [])`
> runs `func` only once when the component mounts!

```js
const requestAccounts = async () => {
  if (!window.ethereum) {
    return null;
  }
  const [account] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return account;
};

function App() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    requestAccounts().then(setAccount).catch(console.error);
  }, []);

  //...
}
```

How ever there are two problems here! First the user gets prompted before they can see the app and if they change their account the app doesn't update!

### Listening to Account Changes

`ethereum` object is an `EventEmitter` so we can listen to `accountsChanged` event when we initialize our application.

```js
window.ethereum.on("accountsChanged", accounts => {
  setAccount(accounts[0]); // set new account state
});
```

### Accessing Accounts

There is an alternative method called `eth_accounts` that query MetaMask if the user has already connected their account to our application. If user has already connected their account MetaMask will simply return the account without prompting.

```js
const [account] = await window.ethereum.request({
  method: "eth_accounts",
});
```

## Interacting with EVM using [`ethers`][ethers]

We will be using [`ethers`][ethers] to interact with the blockchain. `ethers` can be installed with `npm` simply by running following command in the terminal.
```bash
npm i ethers
```

`ethers` library includes multiple types of providers for accessing onchain data. These include popular providers like [`InfuraProvider`](https://docs.ethers.io/v5/api/providers/api-providers/#InfuraProvider) (a popular JSON-RPC endpoint provider, [website](https://infura.io/)), generic providers such as [`JsonRpcProvider`](https://docs.ethers.io/v5/api/providers/api-providers/#InfuraProvider) and [`Web3Provider`](https://docs.ethers.io/v5/api/providers/other/#Web3Provider) which connects using MetaMask.

We can initialize our provider with global `ethereum` object as follows.
```js
import { ethers } from "ethers";

// ...

const provider = new ethers.providers.Web3Provider(window.ethereum);
```

Having initialized our provider we can now access chain data! Let's start by building a `Balance` React component that display's chain's default coin in this case AVAX. `Balance` component receives `account` and `provider` as props and computes the balance and displays it.

```jsx
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
  return <p>Balance: {balance} AVAX</p>;
};
```

We derive our balance state from `account` and `provider` using `useEffect` hook. If the user changes their account their balance is recalculated. We use `provider.getBalance(account)` function to access user's AVAX balance and convert it to string using `formatEther` function.

> In EVM balance of a ERC20 token is stored as a unsigned 256-bit integer. However, JavaScript `Number` type is a [double-precision 64-bit binary format IEEE 754][float] so balance of an account can be larger than JavaScript's numbers allow. `ethers` library represents these numbers as `BigNumber` type and `formatEther` utility function can be used to convert `BigNumber` to `String`.


[vite]: https://vitejs.dev/
[ethers]: https://github.com/ethers-io/ethers.js
[float]: https://en.wikipedia.org/wiki/Floating-point_arithmetic
