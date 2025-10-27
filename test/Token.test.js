require("@nomicfoundation/hardhat-chai-matchers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const parseUnits = (value, d = 18) =>
  typeof ethers.parseUnits === "function" ? ethers.parseUnits(value, d) : ethers.utils.parseUnits(value, d);

const deployAndWait = async (factory, ...args) => {
  const c = await factory.deploy(...args);
  if (typeof c.deployed === "function") await c.deployed();
  if (typeof c.waitForDeployment === "function") await c.waitForDeployment();
  return c;
};

describe("Token", function () {
  it("Deploys with correct initial supply", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    expect(await token.totalSupply()).to.equal(parseUnits("1000"));
    expect(await token.balanceOf(owner.address)).to.equal(parseUnits("1000"));
  });

  it("Has correct name and symbol", async function () {
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    expect(await token.name()).to.equal("TestToken");
    expect(await token.symbol()).to.equal("TTK");
  });

  it("Has correct decimals value", async function () {
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    expect(await token.decimals()).to.equal(18);
  });

  it("Allows token transfer between accounts", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await token.transfer(addr1.address, parseUnits("100"));
    expect(await token.balanceOf(addr1.address)).to.equal(parseUnits("100"));
    expect(await token.balanceOf(owner.address)).to.equal(parseUnits("900"));
  });

  it("Allows approved account to transfer tokens with transferFrom", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await token.approve(addr1.address, parseUnits("200"));
    await token.connect(addr1).transferFrom(owner.address, addr2.address, parseUnits("150"));
    expect(await token.balanceOf(addr2.address)).to.equal(parseUnits("150"));
    expect(await token.allowance(owner.address, addr1.address)).to.equal(parseUnits("50"));
  });

  it("Fails transferFrom if not enough allowance", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await token.approve(addr1.address, parseUnits("50"));
    await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, parseUnits("100"))).to.be.reverted;
  });

  it("Fails transfer if sender has insufficient balance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await expect(token.connect(addr1).transfer(owner.address, parseUnits("10"))).to.be.reverted;
  });

  it("Emits Transfer event on transfer", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await expect(token.transfer(addr1.address, parseUnits("100")))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr1.address, parseUnits("100"));
  });

  it("Emits Approval event on approve", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await expect(token.approve(addr1.address, parseUnits("200")))
      .to.emit(token, "Approval")
      .withArgs(owner.address, addr1.address, parseUnits("200"));
  });

  it("Emits Transfer event on transferFrom", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await deployAndWait(Token, parseUnits("1000"));
    await token.approve(addr1.address, parseUnits("100"));
    await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, parseUnits("100")))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr2.address, parseUnits("100"));
  });
});
