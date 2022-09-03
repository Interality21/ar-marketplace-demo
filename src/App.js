import './App.css'
import NftsCollection from './NftsCollection'
import React, { useState } from 'react'

function App () {
  const [address, setAddress] = useState(window.ethereum.selectedAddress ? window.ethereum.selectedAddress : null)
  const connectWallet = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((res) => setAddress(res[0]))
  }
  const disconnectWallet = async () => {
    setAddress(null)
  }
  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
        <header>Interality AR MarketPlace</header>
        {address ? <button onClick={disconnectWallet}> {address.substring(0, 8) + '...' }</button> : <button onClick={connectWallet}>Connect Wallet</button>}
        </div>
      {address && <NftsCollection />}
    </div>
  )
}

export default App
