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

[vite]: https://vitejs.dev/
