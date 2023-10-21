import { CSSProperties } from 'react'
import { AssetReference, Chain, assert, capitalize, FungibleToken } from '@freemarket/client-sdk'
import UnknownAssetIcon from './UnknownAssetIcon'
import { useAssetInfo } from './useAssetInfo'

export interface AssetViewProps {
  assetRef: AssetReference
  chain: Chain
  fungibleTokens: FungibleToken[]
  style?: CSSProperties
}

export default function AssetView(props: AssetViewProps) {
  const { assetRef, chain, fungibleTokens } = props
  assert(typeof assetRef !== 'string')

  const assetInfo = useAssetInfo(assetRef, chain, fungibleTokens ?? [])
  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    ...props.style,
  }

  // undefined means useAssetInfo is still loading, don't render anything
  if (assetInfo === undefined) {
    // TODO maybe decide on a rect size here and render a blank rect so it takes up the same amount of space
    return null
  }

  if (assetInfo === 'unknown') {
    let name: string
    if (assetRef.type === 'fungible-token') {
      name = assetRef.symbol
    } else {
      name = `${capitalize(chain)} Native`
    }
    return (
      <div style={style}>
        <UnknownAssetIcon /> {name}
      </div>
    )
  }
  return (
    <div style={style}>
      <img width={24} height={24} src={assetInfo?.iconUrl} alt={assetInfo.symbol} />
      {assetInfo.symbol}
    </div>
  )
}
