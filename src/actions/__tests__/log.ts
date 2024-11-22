import { TestHelpers } from '@awell-health/extensions-core'
import { log as actionInterface } from '..'

describe('HelloWorld - log', () => {
  const {
    extensionAction: log,
    onComplete,
    onError,
    helpers,
    clearMocks,
  } = TestHelpers.fromAction(actionInterface)

  beforeEach(() => {
    clearMocks()
  })

  test('Should call onComplete', async () => {
    await log.onEvent({
      payload: {
        pathway: {
          id: 'pathway-id',
          definition_id: 'pathway-definition-id',
        },
        activity: { id: 'test-activity' },
        patient: { id: 'test-patient' },
        fields: {
          hello: 'Some text',
          string_dropdown: 'option1',
          number_dropdown: 1,
        },
        settings: {
          secret: 'secret-value',
        },
      },
      onComplete,
      onError,
      helpers,
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        data_points: {
          world: 'Some text',
          string_selection: 'option1',
          number_selection: '1',
        },
      })
    )
  })
  test('Should call onComplete if fields are undefined', async () => {
    await log.onEvent({
      payload: {
        pathway: {
          id: 'pathway-id',
          definition_id: 'pathway-definition-id',
        },
        activity: { id: 'test-activity' },
        patient: { id: 'test-patient' },
        fields: {
          hello: undefined,
        },
        settings: {
          secret: 'secret-value',
        },
      },
      onComplete,
      onError,
      helpers,
    })
    expect(onComplete).toHaveBeenCalled()
  })
  test('Should call onComplete if settings are undefined', async () => {
    await log.onEvent({
      payload: {
        pathway: {
          id: 'pathway-id',
          definition_id: 'pathway-definition-id',
        },
        activity: { id: 'test-activity' },
        patient: { id: 'test-patient' },
        fields: {
          hello: 'Some text',
        },
        settings: {
          secret: undefined,
        },
      },
      onComplete,
      onError,
      helpers,
    })
    expect(onComplete).toHaveBeenCalled()
  })
})
