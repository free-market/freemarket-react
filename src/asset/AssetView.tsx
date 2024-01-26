import { CSSProperties } from 'react'
import { AssetReference, Chain, assert, capitalize, FungibleToken, Asset } from '@freemarket/client-sdk'
import UnknownAssetIcon from './UnknownAssetIcon'
import { AssetInfoResult, useAssetInfo } from './useAssetInfo'
import UnknownAsset from '../UnknownAsset'

export interface AssetViewProps {
  assetRef?: AssetReference
  asset?: Asset
  chain: Chain
  fungibleTokens: FungibleToken[]
  style?: CSSProperties
  iconSize?: number
}

export default function AssetView(props: AssetViewProps) {
  const { assetRef, asset: assetFromProps, chain, fungibleTokens } = props
  assert(typeof assetRef !== 'string')
  assert(assetRef === undefined || assetFromProps === undefined, 'define asset or assetRef but not both')

  const assetInfo: AssetInfoResult = useAssetInfo(assetRef, chain, fungibleTokens)
  assert(assetFromProps || (assetInfo !== undefined && assetInfo !== 'unknown'))
  const asset: Asset = assetInfo && typeof assetInfo !== 'string' ? assetInfo : assetFromProps!

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    ...props.style,
  }

  // undefined means useAssetInfo is still loading, don't render anything
  if (asset === undefined) {
    // TODO maybe decide on a rect size here and render a blank rect so it takes up the same amount of space
    return null
  }

  if (assetInfo === 'unknown') {
    let name: string
    if (asset.type === 'fungible-token') {
      name = asset.symbol
    } else {
      name = `${capitalize(chain)} Native`
    }
    return (
      <div style={style}>
        <UnknownAssetIcon /> {name}
      </div>
    )
  }
  const iconSize = props.iconSize ?? 24
  return (
    <div style={style}>
      {asset.iconUrl && <img width={iconSize} height={iconSize} src={asset.iconUrl} alt={asset.symbol} />}
      {!asset.iconUrl && <UnknownAsset width={iconSize} height={iconSize} />}
      {asset.symbol}
    </div>
  )
}
