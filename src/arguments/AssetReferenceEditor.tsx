import { AssetReference, PARAMETER_REFERENCE_REGEXP } from '@freemarket/client-sdk'

interface Props {
  error: boolean
  value?: AssetReference
  onChange: (asset: AssetReference) => void
  hideParameter?: boolean
}

export default function AssetReferenceEditor({ value, onChange, error, hideParameter }: Props) {
  const assetType = getAssetRefType(value)
  const assetSymbol = typeof value !== 'string' && value?.type === 'fungible-token' ? value.symbol : ''
  const parameterName = typeof value === 'string' ? getParameterName(value) : ''

  function fireOnChange(nextType: string, nextSymbol: string, nextParameterName: string) {
    if (nextType === 'native') {
      onChange({ type: 'native' })
    } else if (nextType === 'token') {
      onChange({ type: 'fungible-token', symbol: nextSymbol })
    } else {
      onChange(`{{ ${nextParameterName} }}`)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <select
        value={assetType}
        onChange={e => e.target.value && fireOnChange(e.target.value, assetSymbol, parameterName)}
        style={{ minWidth: 110 }}
      >
        <option color="neutral" value="token">
          Token
        </option>
        <option color="neutral" value="native">
          Native
        </option>
      </select>
      <div style={{ minWidth: '195px', display: 'flex', alignItems: 'center' }}>
        {assetType === 'token' && (
          <>
            <label style={{ paddingLeft: 20, paddingRight: 10 }}>Symbol</label>
            <input
              style={{ flexGrow: 1, width: 100 }}
              onChange={e => fireOnChange(assetType, e.target.value, parameterName)}
              value={assetSymbol}
              color={error ? 'danger' : 'neutral'}
            />
          </>
        )}
      </div>
    </div>
  )
}

function getAssetRefType(asset?: AssetReference): string {
  if (typeof asset === 'string') {
    return asset === '' ? 'token' : 'parameter'
  }
  if (asset?.type === 'native') {
    return 'native'
  }
  return 'token'
}

export function getParameterName(s: string) {
  const matchResult = PARAMETER_REFERENCE_REGEXP.exec(s)
  if (matchResult) {
    return matchResult[1]
  }
  return ''
}
