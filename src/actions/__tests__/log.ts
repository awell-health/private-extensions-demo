import { TestHelpers } from '@awell-health/extensions-core'
import { log as actionInterface } from '..'
import { generateTestPayload } from '../../test-helpers'

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
      payload: generateTestPayload({
        fields: {
          hello: 'Some text',
        },
        settings: {
          secret: 'secret-value',
        },
      }),
      onComplete,
      onError,
      helpers,
    })
    expect(onComplete).toHaveBeenCalled()
  })
  test('Should call onComplete if fields are undefined', async () => {
    await log.onEvent({
      payload: generateTestPayload({
        fields: {
          hello: undefined,
        },
        settings: {
          secret: 'secret-value',
        },
      }),
      onComplete,
      onError,
      helpers,
    })
    expect(onComplete).toHaveBeenCalled()
  })
  test('Should call onComplete if settings are undefined', async () => {
    await log.onEvent({
      payload: generateTestPayload({
        fields: {
          hello: 'Some text',
        },
        settings: {
          secret: undefined,
        },
      }),
      onComplete,
      onError,
      helpers,
    })
    expect(onComplete).toHaveBeenCalled()
  })
})
