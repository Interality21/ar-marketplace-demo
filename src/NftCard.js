import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { contractAbi, contractAddress } from './nft'
import "@google/model-viewer/dist/model-viewer";
import { useAccount, useSigner } from "wagmi";
import {ethers} from 'ethers'

const NftCard = ({ nft, tokenId }) => {
  console.log(nft)
  const [price, setPrice] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [remainingTokens, setRemainingTokens] = useState(0)
  const [bought,setBought] = useState(false)
  const [showAR,setShowAR] = useState(false)
  const [contract,setContract] = useState(null)
  const {address} = useAccount()

  const { data: signer } = useSigner();

  const fetchNftInfo = async () => {
    if(!contract) return
    const nftInfo = await contract.sale(tokenId)
    console.log(nftInfo)

    console.log("price",ethers.utils.formatEther(nftInfo.price))
    setPrice(ethers.utils.formatEther(nftInfo.price))
    setTotalTokens(Number(nftInfo.totalTokenCount._hex))
    setRemainingTokens(Number(nftInfo.tokenLeftCount._hex))

    const balanceOf = await contract.balanceOf(address,tokenId)
    
    if(Number(balanceOf._hex) > 0){
      setBought(true)
    }
  }

  const buyNft = async () => {
    const res = await contract.buyNft(tokenId,{value: ethers.utils.parseEther(price)})
    const receipt = await res.wait()
    if(receipt.status === 1){
      console.log("hash",res.hash)
      setBought(true)
    }else{
      alert()
    }
    // await contract.methods 
    //   .buyNft(tokenId)
    //   .send({from: walletAddress, value: Web3.utils.toWei(price,'ether')})
    //   .then(res => {
    //     console.log(res)
    //   })
  }

  const viewInAR = () => {
    setShowAR(true)
  }

  useEffect(() => {
    if(signer){
      const cntrt = new ethers.Contract(contractAddress,contractAbi,signer)
      setContract(cntrt)
    }
  }, [signer])

  useEffect(() => {
    if(contract){
      fetchNftInfo()
    }
  },[contract])
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
