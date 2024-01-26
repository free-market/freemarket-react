import { Chain, formatNumber } from '@freemarket/client-sdk'
import { AssetViewProps } from './AssetView'
import { AssetInfoResult, useAssetInfo } from './useAssetInfo'
import AnimatedNumber from './AnimatedNumber'

export interface AmountViewProps extends AssetViewProps {
  amount: string
  fractionalDigits?: number
}

export default function AmountView(props: AmountViewProps) {
  const { amount } = props
  const chain = props.chain
  const assetInfoFromRef = useAssetInfo(props.assetRef, props.chain, props.fungibleTokens)
  const assetInfo = props.asset || assetInfoFromRef
  if (assetInfo === undefined && props.asset === undefined) {
    return null
  }

  const decimals = getDecimalsForAsset(assetInfo, chain)
  const fd = props.fractionalDigits || 4
  const formatted = formatNumber(amount, decimals, fd)
  // return <AnimatedNumber value={formatted} style={props.style} trailingZeros={fd} />
  return <div style={props.style}>{formatted}</div>
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
