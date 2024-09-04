import Web3 from 'web3';
import config from "./env";
import { MerkleTree } from "merkletreejs";
import { getAddress, solidityKeccak256, keccak256 } from 'ethers/lib/utils';
import { owners } from "./owners";
import { tokenids } from "./tokenids";
import { amounts } from "./amounts";
import { addresses } from "./tokenids";

const contractAddress = config.tbonContract;
const ABI = config.tBonABI;
const web3 = new Web3(Web3.givenProvider);

/*
* This function mints 1 bone, if the user has not yet claimed theirs
*/
const addTokenIdsAndAddresses = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    console.log("🚀 ~ file: add-tokens.js:6 ~ owners:", owners)
    console.log("🚀 ~ file: add-tokens.js:37 ~ addTokenIdsAndAddresses ~ tokenids:", tokenids)
    try {
      // FOR BONE
      const mint = await window.contract.methods.setIsClaimed(
        tokenids, // bone token ID 
        owners,
        true
        )
        .send(
          {
            from: window.ethereum.selectedAddress, 
            value: 0
          }
        );
      return mint;
    } catch (error) {
      console.log("🚀 ~ file: approving-bone.js ~ line 34 ~ mintBone ~ error", error)
    }
  }

}

const airdrop = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      // FOR BONE
      const mint = await window.contract.methods.airdrop(
        addresses, // bone token ID 
        amounts,
        )
        .send(
          {
            from: window.ethereum.selectedAddress, 
            value: 0
          }
        );
      return mint;
    } catch (error) {
      console.log("🚀 ~ file: approving-bone.js ~ line 34 ~ mintBone ~ error", error)
    }
  }

}

export { 
  addTokenIdsAndAddresses,
  airdrop
}