require("@nomicfoundation/hardhat-toolbox");
const { config } = require("dotenv");
const path = require("path");

function loadConfig() {
  const env = process.env.NODE_ENV || "development";
  [".env", ".env.local", `.env.${env}`, `.env.${env}.local`]
    .map(file => path.join(__dirname, file))
    .forEach(file => config({ path: file }));
}
loadConfig();

const GETBLOCKIO_API_KEY = process.env.GETBLOCKIO_API_KEY;
const BSC_SCAN_API_KEY = process.env.BSC_SCAN_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    bsc: {
      url: "https://bsc.getblock.io/mainnet/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY],
      httpHeaders: {
        "x-api-key": GETBLOCKIO_API_KEY,
      },
    },
    bscTestnet: {
      url: "https://bsc.getblock.io/testnet/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [PRIVATE_KEY],
      httpHeaders: {
        "x-api-key": GETBLOCKIO_API_KEY,
      },
    },
  },
  etherscan: {
    apiKey: {
      bsc: BSC_SCAN_API_KEY,
      bscTestnet: BSC_SCAN_API_KEY,
    },
  },
};
