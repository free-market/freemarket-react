import { AssetAmount, AssetReference, Chain, FungibleToken } from '@freemarket/client-sdk'
import React from 'react'
import { useAssetBalances } from './useAssetBalances'
import type { EIP1193Provider } from 'eip1193-provider'
import { AssetInfoResult, useAssetInfos } from './useAssetInfo'
import { useChain } from '../chain/useChain'
import AssetView from './AssetView'
import AssetAmountView, { AssetAmountViewProps } from './AssetAmountView'
import AssetAmountsView from './AssetAmountsView'

export interface WalletBalancesProps {
  stdProvider: EIP1193Provider | null | undefined
  address: string
  assetRefs: AssetReference[]
  fungibleTokens: FungibleToken[]
  refreshToken: any
  style?: React.CSSProperties
}

export default function WalletBalances(props: WalletBalancesProps) {
  const { stdProvider, address, assetRefs, fungibleTokens, refreshToken } = props
  const balances: AssetAmount[] = useAssetBalances(stdProvider, address, assetRefs, fungibleTokens, refreshToken) ?? []
  const chain = useChain(stdProvider)
  const assetInfos = useAssetInfos(assetRefs, chain, fungibleTokens) ?? []
  const length = assetRefs.length
  if (assetInfos.length === length && balances.length === length && chain) {
    return <AssetAmountsView chain={chain} assetAmounts={balances} fungibleTokens={[]} style={props.style} />
  }
  return null
}
