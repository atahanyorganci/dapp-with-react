import { ethers } from "ethers";
import AtaTokenABI from "../abi/ataToken.abi.json";
import StakingAbi from "../abi/staking.abi.json";

export const ATA_TOKEN_ADDRESS = "0x47741C56064B4c129d585CEe9A9d3A3dB7CDA9ce";
export const ATA_TOKEN = new ethers.Contract(ATA_TOKEN_ADDRESS, AtaTokenABI);

export const STAKING_ADDRESS = "0x2Fea511D355e7A6f8A1F9BE566025a19762B9138";
export const STAKING_CONTRACT = new ethers.Contract(
  STAKING_ADDRESS,
  StakingAbi
);
