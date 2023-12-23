import { CSSProperties } from 'react'
import './AnimatedNumber.css'

export interface AnimatedNumberProps {
  value: number | string
  trailingZeros?: number
  style?: CSSProperties
}

export default function AnimatedNumber(props: AnimatedNumberProps) {
  const trailingZeros = props.trailingZeros ?? 4
  const decimalsStr = 10 ** trailingZeros + ''
  const value = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  const style: any = { '--numbervalue': value, '--decimals': decimalsStr, ...props.style }
  if (value === 0) {
    return <div style={style}>{'0.' + '0'.repeat(trailingZeros)}</div>
  }
  console.log('animated number', value, decimalsStr, trailingZeros)
  return <div className="animated-number" style={style} />
}
