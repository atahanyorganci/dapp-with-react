// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract StakingVault is Ownable, Pausable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  event Staked(address _from, uint256 _amount);
  event Withdrawn(address _from, uint256 _amount);
  event RewardClaimed(address _from, uint256 _amount);

  struct StakeState {
    uint256 amount;
    uint256 lastUpdated;
    uint256 previousReward;
  }

  address private stakingBank;
  IERC20 public immutable rewardsToken;
  IERC20 public immutable stakingToken;

  // Reward rate per second per token staked
  uint256 private rewardRate;

  // Total amount of tokens staked
  uint256 private totalSupply;

  // Mapping of staked balances
  mapping(address => StakeState) private balances;

  constructor(
    address _stakingToken,
    address _stakingBank,
    uint256 _rewardRate
  ) {
    require(
      _stakingToken != address(0),
      "StakingVault: staking token address cannot be 0"
    );
    require(
      _stakingBank != address(0),
      "StakingVault: staking bank address cannot be 0"
    );
    require(
      _rewardRate > 0,
      "StakingVault: reward rate must be greater than 0"
    );

    stakingBank = _stakingBank;
    stakingToken = IERC20(_stakingToken);
    rewardsToken = IERC20(_stakingToken);

    rewardRate = _rewardRate;
  }

  function stakedOf(address _account) public view returns (uint256) {
    return balances[_account].amount;
  }

  function rewardOf(address _account) public view returns (uint256) {
    return
      balances[_account].previousReward +
      calculateReward(
        balances[_account].amount,
        balances[_account].lastUpdated
      );
  }

  function totalStaked() public view returns (uint256) {
    return totalSupply;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function setStakingBank(address _stakingBank) public onlyOwner {
    require(
      _stakingBank != address(0),
      "StakingVault: staking bank address cannot be 0"
    );
    stakingBank = _stakingBank;
  }

  function calculateReward(
    uint256 _amount,
    uint256 _from
  ) public view returns (uint256) {
    return ((_amount * (block.timestamp - _from)) * rewardRate) / 1e18;
  }

  modifier updateReward(address _account) {
    uint256 staked = balances[_account].amount;
    if (staked > 0) {
      uint256 reward = calculateReward(staked, balances[_account].lastUpdated);
      balances[_account].previousReward += reward;
    }
    balances[msg.sender].lastUpdated = block.timestamp;
    _;
  }

  function stake(uint256 _amount) public nonReentrant updateReward(msg.sender) {
    require(_amount > 0, "StakingVault: amount must be greater than 0");

    stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
    totalSupply += _amount;
    balances[msg.sender].amount += _amount;

    emit Staked(msg.sender, _amount);
  }

  function withdraw(
    uint256 _amount
  ) public nonReentrant updateReward(msg.sender) {
    uint256 staked = balances[msg.sender].amount;
    require(
      _amount <= staked,
      "StakingVault: withdraw amount cannot be greater than staked amount"
    );
    require(staked > 0, "StakingVault: no tokens staked");

    stakingToken.safeTransfer(msg.sender, _amount);
    totalSupply -= _amount;
    balances[msg.sender].amount -= _amount;
    emit Withdrawn(msg.sender, _amount);
  }

  function claimReward() public nonReentrant updateReward(msg.sender) {
    uint256 reward = balances[msg.sender].previousReward;
    require(reward >= 0, "StakingVault: no rewards to claim");

    rewardsToken.safeTransfer(msg.sender, reward);
    balances[msg.sender].previousReward = 0;
    emit RewardClaimed(msg.sender, reward);
  }
}
