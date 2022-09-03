import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Web3 from 'web3'
import { contractAbi, contractAddress } from './nft'
import "@google/model-viewer/dist/model-viewer";


const NftCard = ({ nft, tokenId }) => {
  console.log(nft)
  const [price, setPrice] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [remainingTokens, setRemainingTokens] = useState(0)
  const [bought,setBought] = useState(false)
  const [showAR,setShowAR] = useState(false)

  const walletAddress = window.ethereum.selectedAddress
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(contractAbi,contractAddress)

  const fetchNftInfo = async () => {
    console.log('contract',contract)
    console.log('contract.methods',contract.methods)
    if(!contract.methods) return
    const nftInfo = await contract.methods
      .sale(tokenId)
      .call()
      .then(r => r)

    setPrice(Web3.utils.fromWei(nftInfo.price,'ether'))
    setTotalTokens(nftInfo.totalTokenCount)
    setRemainingTokens(nftInfo.tokenLeftCount)

    const balanceOf = await contract.methods
      .balanceOf(walletAddress,tokenId)
      .call()
      .then(r => r)
    console.log(balanceOf)
    if(balanceOf > 0){
      setBought(true)
    }
  }

  const buyNft = async () => {
    await contract.methods 
      .buyNft(tokenId)
      .send({from: walletAddress, value: Web3.utils.toWei(price,'ether')})
      .then(res => {
        console.log(res)
      })
  }

  const viewInAR = () => {
    setShowAR(true)
  }

  useEffect(() => {
    fetchNftInfo()
  }, [])
  return (
    <>
    <div className='nft-card' style={{ fontSize: '20px' }}>
        <div className='df row' style={{ fontWeight: 'bold', marginBottom: '15px' }}><img src="/logo.jpeg" style={{ widht: '30px', height: '30px', borderRadius: '30px', marginRight: '10px' }} alt="interality"/> @Interality</div>
        <img src={nft.image} alt={nft.name} style={{ width: '320px', height: '320px', borderRadius: '15px', objectFit: 'cover' }}/>
        <div style={{ margin: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>{nft.name}</div>
          <div style={{ alignItems: 'center', display: 'flex' }}>{price} <img src="MaticLogo.png" style={{ width: '20px', height: '20px', marginLeft: '5px' }} alt="Matic"/></div>
          </div>
          <div style={{ marginLeft: '15px', marginBottom: '15px', fontSize: '15px', fontWeight: 'bold', color: 'grey' }}>{remainingTokens}/{totalTokens}</div>
          {bought ? <button style={{ width: 'fit-content', marginLeft: '15px' }} onClick={viewInAR}>View in AR</button> : <button style={{ width: 'fit-content', marginLeft: '15px' }} onClick={buyNft}> Buy To View</button>}
    </div>
    {showAR && <>
    <div className='modalContainer'>
      <div style={{zIndex: '100'}}>
        <model-viewer  
          alt={nft.name}
          src={nft.animation_url}
          ar
          ar-modes="webxr scene-viewer quick-look"
          poster={nft.image}
          camera-controls
          seamless-poster
          shadow-intensity="1"
          touch-action="pan-y"
          style={{width: '50vw',height: '50vw'}}
        />
      </div>
      <div className='full-screen-bg' onClick={() => {
        setShowAR(false)
      }} />
      </div>
      
      </>}
    </>
  )
}

NftCard.propTypes = () => {
  return {
    nft: PropTypes.object,
    tokenId: PropTypes.number
  }
}

export default NftCard
