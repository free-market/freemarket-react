import {
  AssetAmount,
  AssetInfoService,
  AssetReference,
  Chain,
  FungibleToken,
  IERC20__factory,
  assert,
  getEthersProvider,
} from '@freemarket/client-sdk'
import { useEffect, useState } from 'react'
import { type Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import type { EIP1193Provider } from 'eip1193-provider'
import { useChain } from '../chain/useChain'

export function useAssetBalances(
  stdProvider: EIP1193Provider | null | undefined,
  address: string,
  assetRefs: AssetReference[],
  fungibleTokens: FungibleToken[],
  refreshToken: any
): AssetAmount[] | undefined {
  const [assetAmounts, setAssetAmounts] = useState<AssetAmount[] | undefined>(undefined)
  const chain = useChain(stdProvider)
  useEffect(() => {
    if (stdProvider && chain) {
      const provider = getEthersProvider(stdProvider)
      void getAssetBalances(provider, address, assetRefs, chain).then(setAssetAmounts)
    }
  }, [stdProvider, assetRefs, chain, fungibleTokens, refreshToken, address])
  return assetAmounts
}

async function getAssetBalances(provider: Provider, address: string, assetRefs: AssetReference[], chain: Chain): Promise<AssetAmount[]> {
  const promises = assetRefs.map(async assetRef => getAssetBalance(provider, address, assetRef, chain))
  return Promise.all(promises)
}

async function getAssetBalance(provider: Provider, address: string, assetRef: AssetReference, chain: Chain): Promise<AssetAmount> {
  assert(typeof assetRef !== 'string')
  let bn: BigNumber
  if (assetRef.type === 'native') {
    bn = await provider.getBalance(address)
  } else {
    const asset = await AssetInfoService.dereferenceAsset(assetRef, chain, [])
    assert(asset.type === 'fungible-token')
    const tokenAddress = asset.chains[chain]?.address
    if (tokenAddress === undefined) {
      bn = BigNumber.from(0)
    } else {
      const erc20 = IERC20__factory.connect(tokenAddress, provider)
      bn = await erc20.balanceOf(address)
    }
  }
  const ret: AssetAmount = {
    asset: assetRef,
    amount: bn.toString(),
  }
  return ret
}
