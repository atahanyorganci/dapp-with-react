// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DummyToken is ERC20, Ownable {
  uint8 constant CLAIM_STATUS_PENDING = 0;
  uint8 constant CLAIM_STATUS_CLAIMED = 1;
  uint256 constant REWARD_AMOUNT = 1000 * 10 ** 18;

  mapping(address => uint8) claimants;

  constructor() ERC20("DummyToken", "DT") {
    _mint(msg.sender, 1_000_000 * 10 ** 18);
  }

  function mint(address _account, uint256 _amount) public onlyOwner {
    _mint(_account, _amount);
  }

  function claim() public {
    require(!hasClaimed(msg.sender), "Already claimed");
    _mint(msg.sender, REWARD_AMOUNT);
    claimants[msg.sender] = CLAIM_STATUS_CLAIMED;
  }

  function hasClaimed(address _account) public view returns (bool) {
    return claimants[_account] == CLAIM_STATUS_CLAIMED;
  }
}
