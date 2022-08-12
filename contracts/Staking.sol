// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking is Ownable, Pausable, ReentrancyGuard {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  event Staked(address _from, uint256 _amount);
  event Withdrawn(address _from, uint256 _amount);
  event RewardClaimed(address _from, uint256 _amount);

  IERC20 public rewardsToken;
  IERC20 public stakingToken;

  uint256 private rewardRate;
  uint256 private lastUpdateTime;
  uint256 private rewardPerTokenStored;

  address private stakingBank;

  mapping(address => uint256) private userRewardPerTokenPaid;
  mapping(address => uint256) private rewards;

  uint256 private totalSupply;
  mapping(address => uint256) private _balances;

  address[] private walletList;

  constructor(
    address _stakingToken,
    address _stakingBank,
    uint256 _rewardRate
  ) {
    require(_stakingToken != address(0), "Staking token address cannot be 0");
    require(_stakingBank != address(0), "Staking bank address cannot be 0");

    stakingToken = IERC20(_stakingToken);
    rewardsToken = IERC20(_stakingToken);

    stakingBank = _stakingBank;
    rewardRate = _rewardRate;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function updateStakingBank(address _stakingBank) public onlyOwner {
    require(_stakingBank != address(0), "Staking bank address cannot be 0");
    stakingBank = _stakingBank;
  }

  function updateRewardRate(uint256 _rate)
    public
    onlyOwner
    updateReward(address(0))
  {
    rewardRate = _rate;
  }

  function rewardPerToken() private view returns (uint256) {
    if (totalSupply == 0) {
      return rewardPerTokenStored;
    }
    return
      rewardPerTokenStored.add(
        (block.timestamp).sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(
          totalSupply
        )
      );
  }

  function earned(address account) private view returns (uint256) {
    return
      _balances[account]
        .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
        .div(1e18)
        .add(rewards[account]);
  }

  modifier updateReward(address account) {
    rewardPerTokenStored = rewardPerToken();
    lastUpdateTime = block.timestamp;

    if (account != address(0)) {
      rewards[account] = earned(account);
      userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }
    _;
  }

  function stake(uint256 _amount)
    external
    nonReentrant
    updateReward(msg.sender)
  {
    require(_amount > 0, "Stake amount must be greater than 0.");

    totalSupply = totalSupply.add(_amount);

    if (_balances[msg.sender] == 0) {
      walletList.push(msg.sender);
    }
    _balances[msg.sender] = _balances[msg.sender].add(_amount);
    stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
    emit Staked(msg.sender, _amount);
  }

  function withdraw(uint256 _amount)
    external
    nonReentrant
    updateReward(msg.sender)
  {
    require(
      _amount <= _balances[msg.sender],
      "Withdraw amount must be less than or equal to balance"
    );

    if (_amount > 0) {
      totalSupply = totalSupply.sub(_amount);
      _balances[msg.sender] = _balances[msg.sender].sub(_amount);
      stakingToken.safeTransfer(msg.sender, _amount);
      emit Withdrawn(msg.sender, _amount);
    }
  }

  function claimReward() external nonReentrant updateReward(msg.sender) {
    uint256 reward = rewards[msg.sender];
    if (reward > 0) {
      rewards[msg.sender] = 0;
      rewardsToken.safeTransferFrom(stakingBank, msg.sender, reward);
      emit RewardClaimed(msg.sender, reward);
    }
  }

  function getStaked() external view returns (uint256) {
    return _balances[msg.sender];
  }

  function getStakedOf(address _account) external view returns (uint256) {
    return _balances[_account];
  }

  function getReward() external view returns (uint256) {
    return earned(msg.sender);
  }

  function getRewardOf(address _account)
    external
    view
    onlyOwner
    returns (uint256)
  {
    return earned(_account);
  }

  function getTotalStaked() external view returns (uint256) {
    return totalSupply;
  }
}
