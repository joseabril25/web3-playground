import config from "./env";
import { ethers } from 'ethers';


const contractAddress = config.wenwlContract;
const ABI = config.wnwlABI;
const web3 = new ethers.getDefaultProvider("homestead", {
  infura: "f1c5df8c5af24bab9325a6d8e36e6b5a"
});

/*
  * This function mints 1 bone, if the user has not yet claimed theirs
*/
const withdraw = async () => {
  if (window.ethereum) { 
    const wallet = new ethers.Wallet('3410549d9b5ee16b58c7b3f59c46fa75fb75b3b5ace9ac00bcf98a9ccca95a9d')
    const connectedWallet = wallet.connect(web3)
    const contract = await new ethers.Contract(contractAddress, ABI, connectedWallet);
    try {
      const overrides = {
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits('150', 'gwei').toString(),
        type: 1,
        accessList: [
          {
            address: "0x3E5DD6E92c0617377B94B560737707bB80f62052",
            storageKeys: [
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
          },
          {
            address: "0x8975b2c67Cffc4498D927B0B18C7c9030512672B",
            storageKeys: [
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
          },
          {
            address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',  // gnosis safe master address
            storageKeys: []
          }
        ]
      }
      const withdrawTx = await contract.withdraw(overrides) // CONTRACT FUNCTION
      console.log("🚀 ~ file: wen-wl.js ~ line 75 ~ withdraw ~ withdrawTx", withdrawTx)
    } catch (error) {
      console.log("🚀 ~ file: approving-bone.js ~ line 34 ~ mintBone ~ error", error)
    }
  }

}

export { 
  withdraw
}