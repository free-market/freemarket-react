import { FormControlRegisterer } from './useForm'

interface SelectOptions {
  value: string
  label: string
}

export interface SelectProps extends FormControlRegisterer {
  options: SelectOptions[]
}

export type SelectRenderer = (renderProps: SelectProps) => React.ReactElement
