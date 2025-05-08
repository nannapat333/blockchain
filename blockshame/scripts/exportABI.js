const fs = require('fs');
const path = require('path');
const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts');
const outputPath = path.join(__dirname, '..', 'buddha-nft-marketplace', 'src', 'utils', 'contractAddresses.json');

function extractContractInfo(name) {
  const artifact = require(path.join(artifactsPath, `${name}.sol`, `${name}.json`));
  return { abi: artifact.abi, address: 'FILL_IN_AFTER_DEPLOY' };
}

const contracts = {
  BuddhaNFT: extractContractInfo('BuddhaNFT'),
  Marketplace: extractContractInfo('Marketplace'),
  EnglishAuction: extractContractInfo('EnglishAuction'),
  LuckyBidAuction: extractContractInfo('LuckyBidAuction'),
  AuctionManager: extractContractInfo('AuctionManager'),
};

fs.writeFileSync(outputPath, JSON.stringify(contracts, null, 2));
console.log('✅ Contract ABIs and addresses exported.');