const { ethers, network } = require("hardhat");
const fs = require("fs");

const frontEndContractsFile = "../nextjs-nft-marketplace-fe/constants/networkMapping.json";

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end...");
        await updateContractAddresses();
    }
};

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace");
    const chainId = network.config.chainId.toString();
    const contractAdresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"));
    if (chainId in contractAdresses) {
        if (!contractAdresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAdresses[chainId]["NftMarketplace"].push(nftMarketplace.address);
        }
    } else {
        contractAdresses[chainId] = {NftMarketplace: [nftMarketplace.address]};
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAdresses));
}

module.exports.tags = ["all", "frontend"];
