import Web3 from 'web3';
import config from "./env";

const contractAddress = config.corgiContract;
const ABI = config.corgiABI;

const web3 = new Web3(Web3.givenProvider);


/*
  * This function checks if early access minting is currently active
*/
const checkIfEarlyAccessIsActive = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const isActive = await  window.contract.methods.earlyAccessIsActive().call()
      return isActive;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks if minting is currently active
*/
const checkIfMintIsActive = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const isActive = await  window.contract.methods.corgiSaleIsActive().call()
      return isActive;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks balance of user
  * We probably don't need this function
*/
const balanceOf = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const balance = await  window.contract.methods.balanceOf(window.ethereum.selectedAddress).call()
      return balance;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks maximum number of Early Access Corgis
  * Amount should be: 2000
*/
const checkMaxEarlyAccess = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const maxEarlyAccess = await  window.contract.methods.maxEarlyAccess().call()
      return maxEarlyAccess;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks maximum number of Early Access Corgis
  * Amount should be: 9999
*/
const checkMaxCorgisAvailable = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const maxEarlyAccess = await  window.contract.methods.maxCorgis().call()
      return maxEarlyAccess;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}


/*
  * This function checks number of Corgis minted
*/
const checkCurrentCorgisMinted = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const currentBones = await  window.contract.methods.totalSupply().call()
      return currentBones;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks maximum number of Early Access Corgis Mint per Transaction
  * Amount should be: 5
*/
const checkMaxEarlyAccessMint = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const maxPurchase = await  window.contract.methods.maxEarlyAccessPurhase().call()
      return maxPurchase;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks maximum number of Early Access Corgis Mint per Transaction
  * Amount should be: 10
*/
const checkMaxMint = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const maxPurchase = await  window.contract.methods.maxPurchase().call()
      return maxPurchase;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks mint price
  * Amount should be: 0.05
*/
const checkMintPrice = async () => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const maxPurchase = await window.contract.methods.price().call()
      return maxPurchase;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function checks bone balance for Corgis
  * 
*/
const checkBoneBal = async ({boneTokenId}) => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const maxPurchase = await window.contract.methods.checkBoneBalance(boneTokenId).call()
      return maxPurchase;
    } catch (error) {
      console.log('eearly access error:: ', error)
    }
  }
}

/*
  * This function mints Corgis
  * Max 5 only
  * Must have 1 Bone
  * FOR EARLY ACCESS
*/
const mintEarlyAccess = async ({amount, numberOfTokens, boneTokenId}) => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const convertedAmount = web3.utils.toWei(amount.toString());

      const mint = await  window.contract.methods.earlyAccessMint(boneTokenId, numberOfTokens)
        .send({
          from: window.ethereum.selectedAddress,
          value: convertedAmount // This should be the computed amount: 5 x 0.05 = 0.25
        });
      console.log("🚀 ~ file: approving-bone.js ~ line 31 ~ mintEarlyAccess ~ mint", mint)
      return mint;
    } catch (error) {
      console.log("🚀 ~ file: approving-bone.js ~ line 34 ~ mintEarlyAccess ~ error", error)
    }
  }
}

/*
  * This function mints Corgis
  * Max 10 only
  * FOR PUBLIC SALE
*/
const mintCorgis = async ({amount, numberOfTokens}) => {
  if (window.ethereum) { 
    window.contract = await new web3.eth.Contract(ABI, contractAddress);
    try {
      const convertedAmount = web3.utils.toWei(amount.toString());
      const mint = await  window.contract.methods.mintCorgis(numberOfTokens)
        .send({
          from: window.ethereum.selectedAddress,
          value: convertedAmount // This should be the computed amount: 5 x 0.05 = 0.25
        });
      console.log("🚀 ~ file: approving-bone.js ~ line 31 ~ mintBone ~ mint", mint)
      return mint;
    } catch (error) {
      console.log("🚀 ~ file: approving-bone.js ~ line 34 ~ mintBone ~ error", error)
    }
  }
}

export { 
  balanceOf,
  mintEarlyAccess,
  checkMaxEarlyAccess,
  checkMaxCorgisAvailable,
  checkCurrentCorgisMinted,
  checkIfEarlyAccessIsActive,
  checkIfMintIsActive,
  checkMaxEarlyAccessMint,
  checkMaxMint,
  checkMintPrice,
  mintCorgis,
  checkBoneBal
}