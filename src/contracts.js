import { ethers } from "ethers";
import DummyTokenABI from "../abi/dummyToken.abi.json";
import StakingAbi from "../abi/staking.abi.json";

export const DUMMY_TOKEN_ADDRESS = "0x5E8F49F4062d3a163cED98261396821ae2996596";
export const DUMMY_TOKEN = new ethers.Contract(
  DUMMY_TOKEN_ADDRESS,
  DummyTokenABI
);

export const STAKING_ADDRESS = "0xAC1BdE0464D932bf1097A9492dCa8c3144194890";
export const STAKING_CONTRACT = new ethers.Contract(
  STAKING_ADDRESS,
  StakingAbi
);
