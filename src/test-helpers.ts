import { type NewActivityPayload } from '@awell-health/extensions-core'

export const testPayload: NewActivityPayload<any, any> = {
  pathway: {
    id: 'pathway-id',
    definition_id: 'pathway-definition-id',
    tenant_id: 'tenant-id',
    org_slug: 'org-slug',
    org_id: 'org-id',
  },
  activity: {
    id: 'activity-id',
    sessionId: 'session-id',
  },
  patient: {
    id: 'test-patient',
  },
  fields: {},
  settings: {},
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

type FieldsType = Record<string, string | number | boolean | undefined>
type SettingsType = Record<string, string | undefined>
type ReturnType<
  Fields extends FieldsType,
  Settings extends SettingsType
> = Omit<NewActivityPayload, 'fields' | 'settings'> & {
  fields: Fields
  settings: Settings
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Minimal deep merge for plain objects, replacing lodash's `merge` so this
 * package needs no runtime dependency for a single call. Nested plain objects
 * are merged, any other value overwrites, and `undefined` in the source is
 * ignored. Unlike lodash's `merge` this never mutates its arguments.
 */
const deepMerge = (target: unknown, source: unknown): unknown => {
  if (source === undefined) return target
  if (!isPlainObject(target) || !isPlainObject(source)) return source
  const result: Record<string, unknown> = { ...target }
  for (const [key, value] of Object.entries(source)) {
    result[key] = deepMerge(result[key], value)
  }
  return result
}

export const generateTestPayload = <
  Fields extends FieldsType,
  Settings extends SettingsType
>({
  fields,
  settings,
  ...value
}: DeepPartial<Omit<NewActivityPayload, 'fields' | 'settings'>> & {
  fields: Fields
  settings: Settings
}): ReturnType<Fields, Settings> => ({
  ...(deepMerge(testPayload, value) as Omit<
    NewActivityPayload,
    'fields' | 'settings'
  >),
  fields,
  settings,
})
