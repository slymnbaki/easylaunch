const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(ethers.parseUnits("1000", 18), false, false, false);
    await token.waitForDeployment();
  });

  it("Should deploy with correct initial supply", async function () {
    expect(await token.totalSupply()).to.equal(ethers.parseUnits("1000", 18));
    expect(await token.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));
  });

  it("Should allow transfer between accounts", async function () {
    await token.transfer(addr1.address, ethers.parseUnits("100", 18));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
  });

  it("Should not allow mint if canMint is false", async function () {
    await expect(token.mint(owner.address, ethers.parseUnits("10", 18))).to.be.reverted;
  });

  it("Should not allow pause if canPause is false", async function () {
    await expect(token.pause()).to.be.reverted;
  });

  it("Should not allow burn if canBurn is false", async function () {
    await expect(token.burn(ethers.parseUnits("10", 18))).to.be.reverted;
  });
});
