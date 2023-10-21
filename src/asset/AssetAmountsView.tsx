import { AssetAmount, Chain, FungibleToken } from '@freemarket/client-sdk'
import React from 'react'
import AssetView from './AssetView'
import AmountView from './AmountView'

export interface AssetAmountsViewProps {
  chain: Chain
  assetAmounts: AssetAmount[]
  fungibleTokens: FungibleToken[]
  style?: React.CSSProperties
}

export default function AssetAmountsView(props: AssetAmountsViewProps) {
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: 'max-content max-content', columnGap: 15, rowGap: 8, ...props.style }}>
      {props.assetAmounts.map((assetAmount, index) => {
        return [
          <AssetView assetRef={assetAmount.asset} chain={props.chain} key={`asset-${index}`} fungibleTokens={props.fungibleTokens} />,
          <AmountView
            assetRef={assetAmount.asset}
            chain={props.chain}
            key={`amount-${index}`}
            amount={assetAmount.amount.toString()}
            fungibleTokens={props.fungibleTokens}
          />,
        ]
      })}
    </div>
  )
}
