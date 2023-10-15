import { Chain, formatNumber } from '@freemarket/client-sdk'
import AssetView, { AssetViewProps } from './AssetView'
import { AssetInfoResult, useAssetInfo } from './useAssetInfo'
import AnimatedNumber from './AnimatedNumber'
import { CSSProperties } from 'react'
import AmountView from './AmountView'

export interface AssetAmountViewProps extends AssetViewProps {
  amount: string
  assetStyle?: CSSProperties
  amountStyle?: CSSProperties
}

export default function AssetAmountView(props: AssetAmountViewProps) {
  const { amount, assetStyle, amountStyle, ...assetProps } = props
  const chain = props.chain
  const assetInfo = useAssetInfo(props.assetRef, props.chain, props.fungibleTokens)
  if (assetInfo === undefined) {
    return null
  }

  const decimals = getDecimalsForAsset(assetInfo, chain)

  const formatted = formatNumber(amount, decimals)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <AssetView {...assetProps} style={assetStyle} />
      <AmountView
        assetRef={assetProps.assetRef}
        chain={assetProps.chain}
        amount={formatted}
        style={amountStyle}
        fungibleTokens={props.fungibleTokens}
      />
    </div>
  )
}

const DEFAULT_DECIMALS = 18
function getDecimalsForAsset(assetInfo: AssetInfoResult, chain: Chain) {
  if (assetInfo !== undefined && assetInfo !== 'unknown' && assetInfo.type !== 'native') {
    const chains = assetInfo.chains
    const chainInfo = chains[chain]
    if (chainInfo) {
      return chainInfo.decimals
    }
  }
  return DEFAULT_DECIMALS
}
