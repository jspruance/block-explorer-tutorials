// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract OnePercentToken is ERC20Capped, ERC20Burnable {
    address payable public owner;

    /* create an array of token holder addresses so we can 
       later iterate over them and pay out transfer rewards */
    /* TODO: this is a dynamic array - look for another option
       as this might not be scalable */
    address[] public tokenHolders;

    constructor(uint256 cap) ERC20("OnePercentToken", "OPT") ERC20Capped(cap * (10 ** decimals())) {
        // Mint 50% to ower for liquidity pools, etc, leave other 50% for mining rewards
        owner = payable(msg.sender);
        tokenHolders.push(owner);
        _mint(owner, 500000 * (10 ** decimals()));
    }

    /**
     * @dev See {ERC20Capped-_mint}.
     */
    function _mint(address account, uint256 amount) internal virtual override(ERC20Capped, ERC20) {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

    function _mintMinerReward() internal {
        for (uint i=0; i < tokenHolders.length; i++) {
            uint balance = this.balanceOf(tokenHolders[i]);
            // add 1% to token holder's balance
            _mint(payable(tokenHolders[i]), balance / 100);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override {
        // ensure it's a legitimate token transfer to a real wallet address
        if (from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
          // add any new token holders to the array
          bool matchFound = false;
          for (uint i=0; i < tokenHolders.length; i++) {
            if (tokenHolders[i] == to) matchFound = true;
          }
          if (matchFound == false) tokenHolders.push(to);
        }
        super._beforeTokenTransfer(from, to, value);
    }

    function _afterTokenTransfer(address from, address to, uint256 value) internal virtual override {
        // ensure it's a legitimate token transfer to a real wallet address
        if (from != address(0) && to != block.coinbase && block.coinbase != address(0)) {
          _mintMinerReward();
        }
        super._afterTokenTransfer(from, to, value);
    }
}