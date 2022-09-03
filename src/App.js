import './App.css'
import NftsCollection from './NftsCollection'
import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";

function App () {
  const { address } = useAccount()
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <header>Interality AR MarketPlace</header>
        <ConnectButton chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
              accountStatus={{ smallScreen: "icon", largeScreen: "full" }}/>
        </div>
      {address && <NftsCollection />}
    </div>
  )
}

export default App
