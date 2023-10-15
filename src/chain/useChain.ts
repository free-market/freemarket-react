import { Chain, getChainFromProvider } from '@freemarket/client-sdk'
import type { EIP1193Provider } from 'eip1193-provider'
import { useEffect, useState } from 'react'

export function useChain(provider: EIP1193Provider | null | undefined): Chain | undefined {
  const [chain, setChain] = useState<Chain | undefined>(undefined)
  useEffect(() => {
    if (provider) {
      getChainFromProvider(provider).then(setChain)
    }
  }, [provider])
  return chain
}
