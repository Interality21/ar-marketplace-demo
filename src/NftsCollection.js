import React from 'react'
import NftCard from './NftCard'
import json0 from './nftMetadata/0.json'
import json1 from './nftMetadata/1.json'
import json2 from './nftMetadata/2.json'
import json3 from './nftMetadata/3.json'
import json4 from './nftMetadata/4.json'
import json5 from './nftMetadata/5.json'
import json6 from './nftMetadata/6.json'

const NftsCollection = () => {
  const nftJson = [json0, json1, json2, json3, json4, json5, json6]
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '50px', marginTop: '20px' }}>
        {nftJson.map((nft, index) => {
          if(index === 0) return <></>
          return <NftCard nft={nft} tokenId={index} key={index} />
        })}
    </div>
  )
}

export default NftsCollection
