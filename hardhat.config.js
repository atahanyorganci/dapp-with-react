require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const GETBLOCKIO_API_KEY = process.env.GETBLOCKIO_API_KEY;
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    testnet: {
      url: `https://avax.getblock.io/testnet/ext/bc/C/rpc`,
      chainId: 43113,
      accounts: [PRIVATE_KEY],
      httpHeaders: {
        "x-api-key": GETBLOCKIO_API_KEY,
      },
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: SNOWTRACE_API_KEY,
    },
  },
};
