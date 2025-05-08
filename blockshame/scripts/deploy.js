const hre = require("hardhat");

async function main() {
  const BuddhaNFT = await hre.ethers.deployContract("BuddhaNFT");
  await BuddhaNFT.waitForDeployment();
  console.log(`BuddhaNFT deployed to: ${BuddhaNFT.target}`);

  const AuctionManager = await hre.ethers.deployContract("AuctionManager");
  await AuctionManager.waitForDeployment();
  console.log(`AuctionManager deployed to: ${AuctionManager.target}`);

  const EnglishAuction = await hre.ethers.deployContract("EnglishAuction");
  await EnglishAuction.waitForDeployment();
  console.log(`EnglishAuction deployed to: ${EnglishAuction.target}`);

  const LuckyBidAuction = await hre.ethers.deployContract("LuckyBidAuction");
  await LuckyBidAuction.waitForDeployment();
  console.log(`LuckyBidAuction deployed to: ${LuckyBidAuction.target}`);

  const Marketplace = await hre.ethers.deployContract("Marketplace");
  await Marketplace.waitForDeployment();
  console.log(`Marketplace deployed to: ${Marketplace.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});