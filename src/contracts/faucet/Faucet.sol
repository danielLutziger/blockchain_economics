//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


interface LinkTokenInterface {
  function balanceOf(address owner) external view returns (uint256 balance);
  function transfer(address to, uint256 value) external returns (bool success);
  function transferFrom(address from, address to, uint256 value) external returns (bool success);
}

contract Faucet {
    LinkTokenInterface internal LINK;
    address payable owner;
    uint256 private withdrawalAmount = 1 * 10**18;
    uint256 public lockTime = 1 minutes;


    mapping(address => uint256) nextAccessTime;

    constructor() {
        LINK = LinkTokenInterface(0x48120Eb14AB6EBe2C4F937c3c4915ae1DaF96736);
        owner = payable(msg.sender);
    }

    function requestTokens() public {
        require(
            msg.sender != address(0),
            "Request must not originate from a zero account"
        );
        require(
            LINK.balanceOf(address(this)) >= withdrawalAmount,
            "Insufficient balance in faucet for withdrawal request"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficient time elapsed since last withdrawal - try again later."
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;

        LINK.transfer(msg.sender, withdrawalAmount);
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * (10**18);
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function withdraw() public onlyOwner {
        LINK.transfer(msg.sender, LINK.balanceOf(address(this)));
    }
    
    function getBalance() public view returns (uint256) {
        return LINK.balanceOf(address(this));
    }
    
   modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}