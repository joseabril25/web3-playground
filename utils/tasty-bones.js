import Web3 from 'web3';
import config from "./env";
import { MerkleTree } from "merkletreejs";
import { getAddress, solidityKeccak256, keccak256 } from 'ethers/lib/utils';


const contractAddress = config.tastyBonesContract;
const ABI = config.tbABI;
const addresses = config.addresses;
const addressesFreeMint = config.addressesFreeMint;
const addressesPresale = config.addressesPresale;
const addressesRaffle = config.addressesRaffle;
const web3 = new Web3(Web3.givenProvider);

/*
  * This function checks whether the user has already minted a bone
  * If they do, then they can no longer mint
  * OGs can only have 1 Bone
*/
const balanceOf = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const balance = await  window.contract.methods.balanceOf(window.ethereum.selectedAddress).call()
      console.log("🚀 ~ file: approving-bone.js ~ line 33 ~ balanceOf ~ balance", balance)
      return balance;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * Check Bones of Owner
*/
const checkBonesOfOwner = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const currentBones = await  window.contract.methods.bonesOfOwner(window.ethereum.selectedAddress).call()
      console.log("🚀 ~ file: approving-bone.js ~ line 64 ~ checkCurrentBonesMinted ~ currentBones", currentBones)
      return currentBones;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function mints 1 bone, if the user has not yet claimed theirs
*/
const createFreeBoneMerkle = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const boneLeafNodes = addressesPresale.map(addr => solidityKeccak256(["address"],[web3.utils.toChecksumAddress(addr)]));
      const freeBoneMerkleTree = new MerkleTree(
        boneLeafNodes,
        (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"),
        { sortPairs: true });
      const claimingAddress = solidityKeccak256(["address"],[web3.utils.toChecksumAddress(window.ethereum.selectedAddress)]);
      console.log("🚀 ~ file: tasty-bones.js ~ FREE MERKLE ROOT", freeBoneMerkleTree.getHexRoot())
      const testverify = freeBoneMerkleTree.verify(freeBoneMerkleTree.getHexProof(claimingAddress), claimingAddress, freeBoneMerkleTree.getHexRoot());
      console.log("🚀 ~ freeBoneMerkleTree ~ testverify bone", testverify)

      const waitNodes = addressesRaffle.map(addr => solidityKeccak256(["address"],[web3.utils.toChecksumAddress(addr)]));
      const waitMerkleTree = new MerkleTree(
        waitNodes,
        (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"),
        { sortPairs: true });
      const claimingAddress3 = solidityKeccak256(["address"],[web3.utils.toChecksumAddress(window.ethereum.selectedAddress)]);
      console.log("🚀 ~ file: tasty-bones.js ~ FREE MERKLE ROOT", waitMerkleTree.getHexRoot())
      const testverify2 = waitMerkleTree.verify(waitMerkleTree.getHexProof(claimingAddress3), claimingAddress3, waitMerkleTree.getHexRoot());
      console.log("🚀 ~ freeBoneMerkleTree ~ testverify bone", testverify)

      // const leafNodes = addressesPresale.map(addr => solidityKeccak256(["address","uint256"], [web3.utils.toChecksumAddress(addr.address), addr.maxMint]));
      // console.log("🚀 ~ file: tasty-bones.js ~ line 67 ~ createFreeBoneMerkle ~ leafNodes", leafNodes)
      // const freeMintMerkleTree = new MerkleTree(leafNodes, (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"), {sortPairs: true});
      // const maxMint = addressesPresale.find(addr => web3.utils.toChecksumAddress(addr.address) === web3.utils.toChecksumAddress(window.ethereum.selectedAddress)).maxMint
      // const claimingAddress2 = solidityKeccak256(["address","uint256"], [web3.utils.toChecksumAddress(window.ethereum.selectedAddress), maxMint]);
      // console.log("🚀 ~ file: tasty-bones.js ~ ALLOW LIST MERKLE ROOT", freeMintMerkleTree.getHexRoot())
      // const testverify2 = freeMintMerkleTree.verify(freeMintMerkleTree.getHexProof(claimingAddress2), claimingAddress2, freeMintMerkleTree.getHexRoot());
      // console.log("🚀 ~ freeMintMerkleTree ~ testverify free", testverify2)

      // const presaleLeafNodes = addressesRaffle.map(addr => solidityKeccak256(["address","uint256"], [web3.utils.toChecksumAddress(addr.address), addr.maxMint]));
      // const presaleMintMerkleTree = new MerkleTree(presaleLeafNodes, (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"), {sortPairs: true});
      // const maxMint2 = addressesRaffle.find(addr => web3.utils.toChecksumAddress(addr.address) === web3.utils.toChecksumAddress(window.ethereum.selectedAddress)).maxMint
      // const claimingAddress3 = solidityKeccak256(["address","uint256"], [web3.utils.toChecksumAddress(window.ethereum.selectedAddress), maxMint2]);
      // console.log("🚀 ~ file: tasty-bones.js ~ RAFFLE MERKLE ROOT", presaleMintMerkleTree.getHexRoot())
      // const testverify3 = presaleMintMerkleTree.verify(presaleMintMerkleTree.getHexProof(claimingAddress3), claimingAddress3, presaleMintMerkleTree.getHexRoot());
      // console.log("🚀 ~ freeMintMerkleTree ~ testverify presale", testverify3)

      return {
        wl: freeBoneMerkleTree.getHexRoot(), 
        wait: waitMerkleTree.getHexRoot(), 
        // raffleRoot: presaleMintMerkleTree.getHexRoot()
      }

      // const raffleLeafNodes = addressesRaffle.map(addr => solidityKeccak256(["address"],[web3.utils.toChecksumAddress(addr)]));
      // const raffleMintMerkleTree = new MerkleTree(raffleLeafNodes, (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"), {sortPairs: true});
      // const claimingAddress4 = solidityKeccak256(["address"],[web3.utils.toChecksumAddress(window.ethereum.selectedAddress)]);
      // console.log("🚀 ~ file: tasty-bones.js ~ RAFFLE MERKLE ROOT", raffleMintMerkleTree.getHexRoot())
      // const testverify4 = raffleMintMerkleTree.verify(raffleMintMerkleTree.getHexProof(claimingAddress4), claimingAddress4, raffleMintMerkleTree.getHexRoot());
      // console.log("🚀 ~ freeMintMerkleTree ~ testverify raffle", testverify4)
      // return mint;
    } catch (error) {
      console.log("🚀 CREATE HASH ERROR", error)
    }
  }

}


/*
  * This function mints 1 bone, if the user has not yet claimed theirs
*/
const mintFreeWithBone = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      // FOR BONE
      const boneLeafNodes = addressesBoneFree.map(addr => solidityKeccak256(["address"],[web3.utils.toChecksumAddress(addr)]));
      const freeBoneMerkleTree = new MerkleTree(
        boneLeafNodes,
        // (digest: Buffer) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"),
        keccak256,
        { sortPairs: true });
      const claimingAddress = solidityKeccak256(["address"],[web3.utils.toChecksumAddress(window.ethereum.selectedAddress)]);
      console.log("🚀 ~ file: tasty-bones.js ~ BONE MERKLE ROOT", freeBoneMerkleTree.getHexRoot())
      const testverify = freeBoneMerkleTree.verify(freeBoneMerkleTree.getHexProof(claimingAddress), claimingAddress, freeBoneMerkleTree.getHexRoot());
      console.log("🚀 ~ freeBoneMerkleTree ~ testverify", testverify)

      const mint = await window.contract.methods.mintFreeWithBone(
        2, // bone token ID 
        freeBoneMerkleTree.getHexProof(claimingAddress), // bone proof
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


/*
  * This function mints 1 bone, if the user has not yet claimed theirs
*/
const mintFreesale = async ({numOfTokens}) => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      // FOR WL
      const leafNodes = addressesFreeMint.map(addr => solidityKeccak256(["address","uint256"], [addr.address, addr.maxMint]));
      const freeMintMerkleTree = new MerkleTree(leafNodes, (digest) => Buffer.from(keccak256("0x" + digest.toString("hex")).substring(2), "hex"), {sortPairs: true});
      const claimingAddress2 = solidityKeccak256(["address","uint256"], [window.ethereum.selectedAddress, 1]);
      const testverify2 = freeMintMerkleTree.verify(freeMintMerkleTree.getHexProof(claimingAddress2), claimingAddress2, freeMintMerkleTree.getHexRoot());
      console.log("🚀 ~ file: tasty-bones.js ~ line 96 ~ mintFreesale ~ testverify2", testverify2)
      
      const mint = await window.contract.methods.mintFreeWL(
        1, // number to Mint
        freeMintMerkleTree.getHexProof(claimingAddress2), // WL proof
        1, // max Mint
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
  balanceOf,
  checkBonesOfOwner,
  createFreeBoneMerkle,
  mintFreesale,
  mintFreeWithBone
}