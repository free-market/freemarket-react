import { assert } from '@freemarket/client-sdk'
import { ChangeEvent, useState, FormEventHandler } from 'react'
import z from 'zod'

export interface FormControlRegistererBase<T> {
  value?: T
  error?: string
}

export interface FormControlRegisterer extends FormControlRegistererBase<any> {
  onChange: (value: any) => void
}

export interface FormControlRegistererInput extends FormControlRegistererBase<string> {
  name: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

interface FormRegisterer {
  onSubmit: FormEventHandler<HTMLFormElement>
}

interface UseFormResult {
  values: Record<string, any>
  errors: Record<string, string>
  register: (name: string) => FormControlRegisterer
  registerInput: (name: string) => FormControlRegistererInput
  registerForm: FormRegisterer
  submit: () => void
}

type SubmitHandler = (values: Record<string, any>) => void | Promise<void>

export function useForm(initialValues: Record<string, any>, schema: z.Schema<any, any>, submitHandler: SubmitHandler): UseFormResult {
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function onChange(name: string, value: any) {
    const newValues = { ...values, [name]: value }
    setValues(newValues)
    if (submitted) {
      validate(newValues)
    }
  }

  function register(name: string): FormControlRegisterer {
    return {
      value: getValue(name),
      onChange: (value: any) => onChange(name, value),
    }
  }

  function registerInput(name: string): FormControlRegistererInput {
    const value = getValue(name)

    const inputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      onChange(name, value)
    }

    assert(value === undefined || typeof value === 'string')
    return {
      name,
      value: value,
      onChange: inputOnChange,
    }
  }

  function getValue(name: string) {
    return values[name] || ''
  }

  const onFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()
    e.nativeEvent.stopPropagation()
    e.nativeEvent.preventDefault()
    submit()
  }
  const registerForm: FormRegisterer = { onSubmit: onFormSubmit }

  function validate(newValues: Record<string, any>): any {
    const result = schema.safeParse(newValues)
    if (result.success) {
      setErrors({})
      return result.data
    } else {
      const newErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        newErrors[issue.path[0]] = issue.message
      }
      setErrors(newErrors)
      return null
    }
  }

  function submit() {
    setSubmitted(true)
    const validatedValues = validate(values)
    if (validatedValues) {
      submitHandler(validatedValues)
    }
  }

  return { values, errors, register, submit, registerForm, registerInput }
}
