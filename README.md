# Free Market Arguments UI for React

## Overview

This package offers a versatile web form component designed for React applications. It facilitates the collection of parameter values for Free Market workflows. These parameters are essential and must be provided by the caller when invoking the workflow.

## Workflow Parameters Example

Consider the following workflow, which requires a "Start Amount" parameter:

```ts
import { Workflow } from '@freemarket/client-sdk'

const workflow: Workflow = {
  parameters: [
    {
      name: 'startAmount',
      type: 'amount',
      label: 'Start Amount',
    },
  ],
  steps: [
    {
      stepId: 'oneInch',
      type: 'oneInch',
      inputAsset: {
        type: 'native',
      },
      inputAssetSource: 'workflow',
      inputAmount: '{{startAmount}}',
      outputAsset: {
        type: 'fungible-token',
        symbol: 'DAI',
      },
      slippageTolerance: '1',
    },
  ],
}
```

In this example, startAmount serves as the input amount for the swap step. Before submitting this workflow as a transaction, the UI must prompt users to specify the actual amount.

## Using the Free Market Args Collector UI Component

After importing the form:

```ts
import { WorkflowArgumentsForm } from '@freemarket/args-ui-react'
```

Render the form within your app, passing in a workflow and a submit handler:

```tsx
<WorkflowArgumentsForm workflow={workflow} onSubmit={args => handleArgs(args)} />
```

This component uses the metadata found in `parameters` in the workflow to dynamically render a form for each required element.
The form validates user input and displays basic error messages for invalid input. The form is largely unopinionated for UI choices, with reasonable defaults, allowing web developers enough control to make the component
align with their existing design aesthetics.
