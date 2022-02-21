const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const OnePercentToken = await hre.ethers.getContractFactory("OnePercentToken");
  const onePercentToken = await OnePercentToken.deploy(1000000);

  await onePercentToken.deployed();

  console.log("OnePercentToken deployed to:", onePercentToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
