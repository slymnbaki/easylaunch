require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploy işlemi başlatılıyor:", deployer.address);

  const tokenName = process.env.TOKEN_NAME || "MyToken";
  const tokenSymbol = process.env.TOKEN_SYMBOL || "MTK";
  const tokenSupply = process.env.TOKEN_SUPPLY || "1000000";

  console.log(`Token Adı: ${tokenName}`);
  console.log(`Token Sembolü: ${tokenSymbol}`);
  console.log(`Token Arzı: ${tokenSupply}`);

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(tokenName, tokenSymbol, tokenSupply);

  await token.deployed();

  console.log(`Kontrat başarıyla deploy edildi: ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deploy sırasında hata oluştu:", error);
    process.exit(1);
  });