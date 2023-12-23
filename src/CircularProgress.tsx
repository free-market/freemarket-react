import { CSSProperties } from 'react'
import './CircularProgress.css'

interface Props {
  size?: number
}

export default function CircularProgress(props: Props) {
  const style: CSSProperties = {}
  if (props.size) {
    style.width = props.size
    style.height = props.size
  }
  return <progress style={style} className="pure-material-progress-circular" />
}
