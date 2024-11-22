import {
  Category,
  FieldType,
  type Action,
  type DataPointDefinition,
  type Field,
} from '@awell-health/extensions-core'
import { type settings } from '../settings'

const fields = {
  hello: {
    id: 'hello',
    label: 'Hello',
    description: 'A string field configured at design time',
    type: FieldType.STRING,
  },
  string_dropdown: {
    id: 'string_dropdown',
    label: 'String dropdown',
    description: 'A string dropdown field configured at design time',
    type: FieldType.STRING,
    required: false,
    options: {
      dropdownOptions: [
        {
          label: 'Option 1',
          value: 'option1',
        },
        {
          label: 'Option 2',
          value: 'option2',
        },
      ],
    },
  },
  number_dropdown: {
    id: 'number_dropdown',
    label: 'Number dropdown',
    description: 'A numeric dropdown field configured at design time',
    type: FieldType.NUMERIC,
    required: false,
    options: {
      dropdownOptions: [
        {
          label: 'Option 1',
          value: 1,
        },
        {
          label: 'Option 2',
          value: 2,
        },
      ],
    },
  },
} satisfies Record<string, Field>

const dataPoints = {
  world: {
    key: 'world',
    valueType: 'string',
  },
  string_selection: {
    key: 'string_selection',
    valueType: 'string',
  },
  number_selection: {
    key: 'number_selection',
    valueType: 'number',
  },
} satisfies Record<string, DataPointDefinition>

export const log: Action<
  typeof fields,
  typeof settings,
  keyof typeof dataPoints
> = {
  key: 'log',
  category: Category.DEMO,
  title: 'Log hello world',
  description: 'This is a dummy Custom Action for extension developers.',
  fields,
  previewable: true,
  dataPoints,
  onEvent: async ({ payload, onComplete }) => {
    const { fields } = payload
    await onComplete({
      data_points: {
        world: fields.hello,
        string_selection: fields.string_dropdown,
        number_selection: String(fields.number_dropdown),
      },
    })
  },
}
