import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import { checkChain, getCurrentWalletConnected } from '../utils/connection';
import { addTokenIdsAndAddresses } from '../utils/add-tokens';
import ImportContract from '../components/ImportContract';
import axios from 'axios';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { useRouter } from 'next/dist/client/router';
//useSWR allows the use of SWR inside function components

const Deploy = () => { 
  const router = useRouter();
  const [hasMetamask, setHasMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [addresses, setAddresses] = useState('');
  const [isCorrectChain, setIsCorrectChain] = useState(false);
  const [contractAddress, setContractAddress] = useState('0xaD490c492852Fc199f982c87C62c5e53F2bFE0cC');
  const [abi, setAbi] = useState(null);
  const [notification, setNotification] = useState(null);
  const [tokenUri, setTokenUri] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const isMetaMaskInstalled = () => {
    return Boolean(window.ethereum)
  }
  
  const onHandleChange = (event) => { 
    setContractAddress(event.target.value);
  }
  
  const handleImport = async () => { 
    setNotification(null);
    setTokenUri([]);
    console.log("🚀 ~ file: admin-app.js:26 ~ handleImport ~ contractAddress:", contractAddress)
    
    // await setSmartContract();
    await doTheProcess();
  }

  const getAbi = async (address) => {
    try {
      const params = new URLSearchParams();
      params.append('apikey', 'NC55AT66XNUPSYG6PART1KP18GDT3ECVSI');
      params.append('module', 'contract');
      params.append('action', 'getabi');
      params.append('address', address);
  
      const { data } = await axios.get(`https://api-testnet.polygonscan.com/api`, {
        params,
      });
      setAbi(data?.result);
      return data?.result;
    } catch (error) {
      return error;
    }
  }

  const setSmartContract = async () => {
    console.log("🚀 ~ file: admin-app.js:18 ~ Deploy ~ abi:", abi)
    const abiRet = await getAbi(contractAddress);
    const provider = await detectEthereumProvider();
    if (!provider) throw new Error('No provider');
    const library = new ethers.providers.Web3Provider(provider);
    const signer = library.getSigner();
    const contract = new ethers.Contract(contractAddress, abiRet, signer);
    return contract;
  }

  const doTheProcess = async () => {
    setLoading(true);
    const contract = await setSmartContract();
    const owner = await contract.owner();
    console.log("🚀 ~ file: admin-app.js:64 ~ checkOwner ~ owner:", owner)
    if(ethers.utils.getAddress(owner) !== ethers.utils.getAddress(window.ethereum.selectedAddress)) {
      setNotification('Not the owner');
      setLoading(false);
    } else {
      setNotification('Yes, the owner');
      await importTokenUri();
    }
  }

  const importTokenUri = async () => {
    const contract = await setSmartContract();
    const totalSupply = await contract.totalSupply();
    const baseUri = await contract.baseURI();
    const uri = [];
    if(totalSupply > 0) {
      for (let index = 0; index < totalSupply; index++) {
        uri.push(baseUri + index);
      }
    }
    setTokenUri(uri);
    setLoading(false);
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
                  <div>
                    <button onClick={() => router.push('view-qr')}>View QR Codes</button>
                  </div>
                  <ImportContract text={contractAddress} handleChange={onHandleChange} onClick={handleImport} />
                  <p>{loading && 'Loading ........' }</p>
                  <p>{notification !== null && notification }</p>
                  { tokenUri.length > 0 && tokenUri.map((uri, _index) => (
                      <p key={_index}>{uri }</p>
                  ))}
                  <p>{tokenUri.length > 0 && 'Save to Database'}</p>
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