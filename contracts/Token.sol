// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    bool public canMint;
    bool public canPause;
    bool public canBurn;

    // constructor matches tests: deploy(parseUnits("1000"))
    constructor(uint256 initialSupply) ERC20("TestToken", "TTK") Ownable(msg.sender) {
        canMint = false;
        canPause = false;
        canBurn = false;
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(canMint, "Minting is not allowed");
        _mint(to, amount);
    }

    function pause() public onlyOwner {
        require(canPause, "Pausing is not allowed");
        _pause();
    }

    function unpause() public onlyOwner {
        require(canPause, "Unpausing is not allowed");
        _unpause();
    }

    function burn(uint256 amount) public override(ERC20Burnable) {
        require(canBurn, "Burning is not allowed");
        super.burn(amount);
    }

    // resolve multiple-inheritance hook conflict
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
