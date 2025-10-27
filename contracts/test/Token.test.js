const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

require("@nomicfoundation/hardhat-chai-matchers");

describe("Token", function () {
  it("Deploys with correct initial supply", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    expect(await token.totalSupply()).to.equal(ethers.parseUnits("1000", 18));
    expect(await token.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));
  });

  it("Has correct name and symbol", async function () {
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    expect(await token.name()).to.equal("TestToken");
    expect(await token.symbol()).to.equal("TTK");
  });

  it("Has correct decimals value", async function () {
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    expect(await token.decimals()).to.equal(18);
  });

  it("Allows token transfer between accounts", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    await token.transfer(addr1.address, ethers.parseUnits("100", 18));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
    expect(await token.balanceOf(owner.address)).to.equal(ethers.parseUnits("900", 18));
  });

  it("Allows approved account to transfer tokens with transferFrom", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    // owner approves addr1 to spend 200 tokens
    await token.approve(addr1.address, ethers.parseUnits("200", 18));
    // addr1 transfers 150 tokens from owner to addr2
    await token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("150", 18));

    expect(await token.balanceOf(addr2.address)).to.equal(ethers.parseUnits("150", 18));
    expect(await token.allowance(owner.address, addr1.address)).to.equal(ethers.parseUnits("50", 18));
  });

  it("Fails transferFrom if not enough allowance", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    await token.approve(addr1.address, ethers.parseUnits("50", 18));
   await expect(
  token.connect(addr1).transfer(owner.address, ethers.parseUnits("10", 18))
).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Fails transfer if sender has insufficient balance", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    await expect(
      token.connect(addr1).transfer(owner.address, ethers.parseUnits("10", 18))
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });

  it("Emits Transfer event on transfer", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    await expect(token.transfer(addr1.address, ethers.parseUnits("100", 18)))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr1.address, ethers.parseUnits("100", 18));
  });

  it("Emits Approval event on approve", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    await expect(token.approve(addr1.address, ethers.parseUnits("200", 18)))
      .to.emit(token, "Approval")
      .withArgs(owner.address, addr1.address, ethers.parseUnits("200", 18));
  });

  it("Emits Transfer event on transferFrom", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("contracts/Token.sol:Token");
    const token = await Token.deploy("TestToken", "TTK", 1000);

    await token.approve(addr1.address, ethers.parseUnits("100", 18));
    await expect(
      token.connect(addr1).transferFrom(owner.address, addr2.address, ethers.parseUnits("100", 18))
    )
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr2.address, ethers.parseUnits("100", 18));
  });
});
