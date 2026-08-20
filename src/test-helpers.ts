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

type FieldsType = Record<string, string | number | boolean | undefined>
type SettingsType = Record<string, string | undefined>

type TestPayload<
  Fields extends FieldsType,
  Settings extends SettingsType
> = Omit<NewActivityPayload, 'fields' | 'settings'> & {
  fields: Fields
  settings: Settings
}

/**
 * Builds a payload for testing an action. `fields` and `settings` are
 * required because they are what a test is usually varying; anything else is
 * an optional shallow override of the defaults above.
 *
 * Overrides replace a top-level key outright rather than merging into it, so
 * pass a whole `pathway`/`activity`/`patient` object if you need to change
 * one. If your tests want merging semantics, that is a choice worth making
 * deliberately in your own repo rather than inheriting it from the template.
 */
export const generateTestPayload = <
  Fields extends FieldsType,
  Settings extends SettingsType
>({
  fields,
  settings,
  ...overrides
}: Partial<Omit<NewActivityPayload, 'fields' | 'settings'>> & {
  fields: Fields
  settings: Settings
}): TestPayload<Fields, Settings> => ({
  ...testPayload,
  ...overrides,
  fields,
  settings,
})
