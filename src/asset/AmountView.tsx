import { Chain, formatNumber } from '@freemarket/client-sdk'
import AssetView, { AssetViewProps } from './AssetView'
import { AssetInfoResult, useAssetInfo, useAssetInfos } from './useAssetInfo'
import AnimatedNumber from './AnimatedNumber'
import { CSSProperties } from 'react'

interface AmountViewProps extends AssetViewProps {
  amount: string
}

export default function AmountView(props: AmountViewProps) {
  const { amount, ...rest } = props
  const chain = props.chain
  const assetInfo = useAssetInfo(props.assetRef, props.chain, props.fungibleTokens)
  if (assetInfo === undefined) {
    return null
  }

  const decimals = getDecimalsForAsset(assetInfo, chain)
  const formatted = formatNumber(amount, decimals)
  return <AnimatedNumber value={formatted} style={props.style} />
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
