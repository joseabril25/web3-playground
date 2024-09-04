import React, { useCallback, useEffect, useState } from 'react';
import { 
  balanceOf, 
  hasEarlyAccess, 
  mintOneBone, 
  checkMaxBones,
  checkCurrentBonesMinted } from '../utils/approving-bone';
import { checkCurrentCorgisMinted, checkIfMintIsActive, checkMaxCorgisAvailable, mintCorgis, mintEarlyAccess } from '../utils/approving-corgis-early-access';
import { checkChain, getCurrentWalletConnected } from '../utils/connection';


const Home = () => { 
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const [maxCorgis, setMaxCorgis] = useState(0);
  const [currentCorgis, setCurrentCorgis] = useState(0);
  const [pubMintQt, setPubMintQt] = useState(0);
  const [isSaleActive, setIsSaleActive] = useState(false);

  const handleChangePub = (event) => {
    setPubMintQt(event.target.value)
  }

  const isMetaMaskInstalled = () => {
    return Boolean(window.ethereum)
  }

  useEffect(() => {
    if(isMetaMaskInstalled()){
      getAccounts();
      setHasMetamask(true);
    } else {
      setHasMetamask(false);
    }
  }, [hasMetamask]);


  useEffect(() => {
    if(isMetaMaskInstalled()) {
      getChainId();
    }
  })

  useEffect(() => {
    if(isMetaMaskInstalled()) {
      window.ethereum.on('chainChanged', () => {
        getChainId();
      })
    }
  })

  const getAccounts = async() => {
    const connection = await getCurrentWalletConnected();
    if(connection.status === 'Connected') {
      setAddresses(connection.address);
      setConnected(true);
      // check if user has early access rights
      checkHasAccessToMintBone();
      checkAvailability();
      checkSaleIsActive();
    }
  }

  const checkSaleIsActive = async () => {
    const isActive = await checkIfMintIsActive();
    setIsSaleActive(isActive);
  }

  const getChainId = async () => {
    const chain = await checkChain();
    setIsCorrectChain(chain);
  }


  const connectMetaMask = async () => {
    getAccounts()
  }

  const checkHasAccessToMintBone = async () => {
    try {
      const balance = await balanceOf();
      if(balance < 1) {
        setAlreadyOwnedBone(false);
        const hasAccess = await hasEarlyAccess();
        setIsAllowedToMint(hasAccess);
      } else {
        setAlreadyOwnedBone(true);
      }
    } catch (error) {
      
    }
  }

  const mintCorgisPub = async () => {
    const payload = {
      amount: (pubMintQt  * 0.05), // number of corgis * price
      numberOfTokens: mintQt,
    }
    const mint = await mintCorgis(payload);
    console.log("🚀 ~ file: index.js ~ line 85 ~ mintBone ~ mint", mint)
  }

  const checkAvailability = async() => {
    const maxCorgis = await checkMaxCorgisAvailable();
    const mintedCorgis = await checkCurrentCorgisMinted();
    setMaxCorgis(maxCorgis);
    setCurrentCorgis(mintedCorgis);
  }

  return (
    <div>
      <div>
        {hasMetamask ? 
          (
            !connected ? 
              <button onClick={() => connectMetaMask()}>Connect Metamask</button>
            :
              (
                isCorrectChain ? (
                  isSaleActive ? 
                  <div>
                    <p>{addresses}</p>
                    <h2>Public Mint</h2>
                    Quantity <input type="number" value={pubMintQt}  onChange={handleChangePub} />
                    <button onClick={() => mintCorgisPub()}>Mint Corgis</button>
                    <p>Current: {currentCorgis} / {maxCorgis}</p>
                  </div>
                  : 
                  <h2>Public Sale is not yet active</h2>
                )
                  :
                  <h2>Wrong Chain. Chain must be Rinkeby</h2>
              )
            )
            :
          <h2>You must install metamask</h2>
        }
      </div>
    </div>
  )
}

export default Home;