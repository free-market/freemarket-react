import React, { useEffect } from 'react'
import { Asset, Workflow, AssetInfoService, AssetReference, Chain, assert, AssetNotFoundError, FungibleToken } from '@freemarket/client-sdk'
import { Maybe } from '../utils'

export type AssetInfoResult = Asset | 'unknown' | undefined

async function getAssetInfo(assetRef: AssetReference, chain: Chain, fungibleTokens: FungibleToken[]): Promise<AssetInfoResult> {
  try {
    return AssetInfoService.dereferenceAsset(assetRef, chain, fungibleTokens)
  } catch (e) {
    if (e instanceof AssetNotFoundError) {
      return 'unknown'
    } else {
      throw e
    }
  }
}
function getAssetInfos(
  refs: AssetReference[],
  chain: Maybe<Chain>,
  fungibleTokens: FungibleToken[]
): Promise<AssetInfoResult[] | undefined> {
  if (!chain) {
    return Promise.resolve(undefined)
  }
  const promises = refs.map(assetRef => getAssetInfo(assetRef, chain, fungibleTokens))
  return Promise.all(promises)
}

// this is an async process, so initially the result is unknown
// if the asset ref cannot be resolved, 'unknown' is returned
// otherwise the asset is returned
export function useAssetInfos(
  assetRefs: AssetReference[],
  chain: Maybe<Chain>,
  fungibleTokens: FungibleToken[]
): AssetInfoResult[] | undefined {
  const [assetInfos, setAssetInfos] = React.useState<AssetInfoResult[] | undefined>(undefined)
  useEffect(() => {
    void getAssetInfos(assetRefs, chain, fungibleTokens).then(setAssetInfos)
  }, [assetRefs, chain, fungibleTokens])
  return assetInfos
}

export function useAssetInfo(assetRef: AssetReference, chain: Chain, fungibleTokens: FungibleToken[]): AssetInfoResult | undefined {
  const [assetInfo, setAssetInfo] = React.useState<AssetInfoResult | undefined>(undefined)
  useEffect(() => {
    void getAssetInfo(assetRef, chain, fungibleTokens).then(setAssetInfo)
  }, [assetRef, chain, fungibleTokens])
  return assetInfo
}
