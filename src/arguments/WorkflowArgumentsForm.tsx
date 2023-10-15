import React, { useMemo, Fragment, useEffect } from 'react'
import { Arguments, Workflow, createParametersSchema, ParameterType, Foo } from '@freemarket/client-sdk'
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AssetReferenceEditor from './AssetReferenceEditor'
// import style from './WorkflowArgumentsForm.module.css'

interface Props {
  workflow: Workflow
  onSubmit: (args: Arguments) => void
  onChange?: (args: Arguments) => void
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
      parametersSchema: createParametersSchema(workflow),
    }),
    [workflow]
  )

  const form = useForm({
    // defaultValues,
    ...(parametersSchema && { resolver: zodResolver(parametersSchema) }),
  })

  const { watch, getValues, control, handleSubmit, formState, register } = form
  const { isValid } = formState

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const result = parametersSchema?.safeParse(value)
      const isValid = result?.success ?? false
      console.log('xxxxxx', isValid, value, name, type)
      if (!result?.success) {
        console.log('result.error', result?.error)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, parametersSchema])

  if (!parametersSchema) {
    return null
  }

  const onSubmitValid: SubmitHandler<any> = data => {
    console.log('onSubmitValid', data)
    onSubmit(data)
  }

  const { errors } = formState

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
        className={'workflowArgumentsForm'}
        onSubmit={handleSubmit(onSubmitValid)}
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            maxWidth: 600,
            display: 'grid',
            gridTemplateColumns: 'min-content 1.75fr',
            rowGap: 0,
            columnGap: 12,
            alignItems: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {params.map(it => {
            const fieldState = form.getFieldState(it.name)
            let helperStyle = 'workflowArgumentsForm__helpText--internal workflowArgumentsForm__helpText'
            let helperText = it.description
            if (fieldState.error) {
              helperStyle += ' workflowArgumentsForm__helpText--error--internal workflowArgumentsForm__helpText--error'
              helperText = fieldState.error.message
            }

            return (
              <Fragment key={`paramPrompt-${it.name}`}>
                <label className="workflowArgumentsForm__label--internal workflowArgumentsForm__label">{it?.label}</label>
                {it.type !== 'asset-ref' && (
                  <input
                    className={'workflowArgumentsForm__input--internal workflowArgumentsForm__input '}
                    {...register(it.name)}
                    placeholder={placeholder(it.type)}
                    style={{ width: '100%' }}
                  />
                )}

                {it.type === 'asset-ref' && (
                  <Controller
                    name={it.name}
                    control={control}
                    render={r => (
                      <AssetReferenceEditor
                        value={r.field.value}
                        onChange={r.field.onChange}
                        error={!!r.fieldState.error}
                        hideParameter={true}
                      />
                    )}
                  />
                )}

                <div />
                <div className={helperStyle}>{helperText}</div>
              </Fragment>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
          <button className="workflowArgumentsForm__button--internal workflowArgumentsForm__button" type="submit">
            <div className="workflowArgumentsForm__button__text--internal workflowArgumentsForm__button__text">Submit</div>
          </button>
        </div>
      </form>
    </>
  )
}
