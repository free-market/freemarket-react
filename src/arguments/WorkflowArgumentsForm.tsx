import React, { useMemo, Fragment } from 'react'
import { Arguments, Workflow, createParametersSchema, ParameterType, Parameter } from '@freemarket/client-sdk'
import { FormControlRegisterer, useForm } from './useForm'
import { z } from 'zod'
import AssetReferenceEditor from './AssetReferenceEditor'
import { InputRenderer } from './InputRenderer'
import { SelectRenderer } from './SelectRenderer'

// import style from './WorkflowArgumentsForm.module.css'

type NoArgsVoidFunc = () => void
type SubmitRenderer = (onSubmitHandler: NoArgsVoidFunc) => React.ReactElement

interface Props {
  workflow: Workflow
  onSubmit: (args: Arguments) => void
  onChange?: (args: Arguments) => void
  inputRenderer?: InputRenderer
  selectRenderer?: SelectRenderer
  submitRenderer?: SubmitRenderer
}

function placeholder(paramType: ParameterType) {
  switch (paramType) {
    case 'address':
      return '0x1234567890123456789012345678901234567890'
    case 'amount':
      return '1000000'
    case 'asset-ref':
      return 'Symbol...'
  }
  return ''
}

export default function WorkflowArgumentsForm(props: Props) {
  const { workflow, onSubmit } = props
  const { params, parametersSchema } = useMemo(
    () => ({
      params: workflow.parameters?.filter(it => !it.name.startsWith('remittances.')) ?? [],
      parametersSchema: createParametersSchema(workflow) || z.object({}),
    }),
    [workflow]
  )

  const handleSubmit = (values: Record<string, string>) => {
    const args = parametersSchema.parse(values)
    onSubmit(args)
  }

  const form = useForm({}, parametersSchema, handleSubmit)

  const { register, registerInput } = form

  if (!parametersSchema) {
    return null
  }

  const renderFormElement = (param: Parameter) => {
    if (param.type !== 'asset-ref') {
      if (props.inputRenderer !== undefined) {
        return props.inputRenderer!(registerInput(param.name))
      }
      return (
        <input
          className={'workflowArgumentsForm__input--internal workflowArgumentsForm__input '}
          {...registerInput(param.name)}
          placeholder={placeholder(param.type)}
        />
      )
    }
    const reg = register(param.name)
    return (
      <AssetReferenceEditor
        value={reg.value}
        onChange={newVal => reg.onChange(newVal)}
        error={reg.error}
        hideParameter={true}
        selectRenderer={props.selectRenderer}
        inputRenderer={props.inputRenderer}
      />
    )
  }

  return (
    <>
      <style>{`

        .workflowArgumentsForm--internal {
        }

        .workflowArgumentsForm__input--internal {
        }
        
        .workflowArgumentsForm__label--internal {
        }

        .workflowArgumentsForm__helpText--internal {
          font-size: 0.85rem;
          margin-top: 2px;
          margin-bottom: 15px;
        }

        .workflowArgumentsForm__helpText--error--internal {
          color: #ff0000;
        }

      `}</style>
      <form
        {...form.registerForm}
        className={'workflowArgumentsForm'}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        autoComplete="off"
        // ref={formRef}
      >
        <div
          style={{
            // maxWidth: 500,
            display: 'grid',
            gridTemplateColumns: '100px minmax(50px, 300px)',
            rowGap: 0,
            columnGap: 12,
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {params.map(it => {
            let helperStyle = 'workflowArgumentsForm__helpText--internal workflowArgumentsForm__helpText'
            let helperText = it.description
            // console.log('fieldState', form.formState.errors[it.name])
            if (form.errors[it.name]) {
              helperStyle += ' workflowArgumentsForm__helpText--error--internal workflowArgumentsForm__helpText--error'
              helperText = form.errors[it.name]
            }

            return (
              <Fragment key={it.name}>
                <label className="workflowArgumentsForm__label--internal workflowArgumentsForm__label">{it?.label}</label>
                <div style={{ width: '100' }}>{renderFormElement(it)}</div>
                <div />
                <div className={helperStyle}>{helperText}</div>
              </Fragment>
            )
          })}
        </div>
        {props.submitRenderer && props.submitRenderer(() => form.submit())}
        {!props.submitRenderer && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <button className="workflowArgumentsForm__button--internal workflowArgumentsForm__button" type="submit">
              <div className="workflowArgumentsForm__button__text--internal workflowArgumentsForm__button__text">Submit</div>
            </button>
          </div>
        )}
      </form>
    </>
  )
}
