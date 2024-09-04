import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import { checkChain, getCurrentWalletConnected } from '../utils/connection';
import { addTokenIdsAndAddresses } from '../utils/add-tokens';
import ImportContract from '../components/ImportContract';
//useSWR allows the use of SWR inside function components

const Deploy = () => { 
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  
  const isMetaMaskInstalled = () => {
    return Boolean(window.ethereum)
  }
  
  const onHandleChange = (event) => { 
    setContractAddress(event.target.value);
  }
  
  const handleImport = () => { 
    console.log("🚀 ~ file: admin.js:14 ~ Deploy ~ contractAddress:", contractAddress)
    console.log('importing contract');
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
      // checkAvailability();
    }
  }

  const getChainId = async () => {
    const chain = await checkChain();
    setIsCorrectChain(chain);
  }


  const connectMetaMask = async () => {
    getAccounts();
  }

  const setTokenIds = async () => {
    await addTokenIdsAndAddresses();
  }

  return (
    <div>
        {hasMetamask ? 
          (
            !connected ? 
              <button onClick={() => connectMetaMask()}>Connect Metamask</button>
              :
              (
                isCorrectChain ?
                <>
                  <p>Connected Address: {addresses}</p>
                  <ImportContract text={contractAddress} handleChange={onHandleChange} onClick={handleImport} />
                </>

                  :
                  <h2>Wrong Chain.</h2>
              )
            )
            :
          <h2>You must install metamask</h2>
        }
      </div>
  )
}
  
export default Deploy;