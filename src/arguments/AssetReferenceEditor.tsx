import { AssetReference, PARAMETER_REFERENCE_REGEXP } from '@freemarket/client-sdk'
import { InputRenderer } from './InputRenderer'
import { SelectProps, SelectRenderer } from './SelectRenderer'

interface Props {
  error?: string
  value?: AssetReference
  onChange: (asset: AssetReference) => void
  hideParameter?: boolean
  inputRenderer?: InputRenderer
  selectRenderer?: SelectRenderer
}

export default function AssetReferenceEditor(props: Props) {
  const { value, onChange, error, hideParameter, inputRenderer, selectRenderer } = props
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

  function renderSelect() {
    if (selectRenderer) {
      const selectProps: SelectProps = {
        value: assetType,
        options: [
          { value: 'token', label: 'Token' },
          { value: 'native', label: 'Native' },
        ],
        onChange: value => fireOnChange(value, assetSymbol, parameterName),
      }

      return selectRenderer(selectProps)
    }
    return (
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
    )
  }

  function renderInput() {
    if (inputRenderer) {
      return inputRenderer({
        name: '',
        value: assetSymbol,
        onChange: value => fireOnChange(assetType, assetSymbol, parameterName),
        error,
      })
    }
    return (
      <input
        type="text"
        value={assetSymbol}
        onChange={e => fireOnChange(assetType, e.target.value, parameterName)}
        style={{ minWidth: 110 }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {renderSelect()}
      {assetType === 'token' && (
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <label style={{ paddingLeft: 20, paddingRight: 10 }}>Symbol</label>
          {renderInput()}
        </div>
      )}
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
