import { demo as webhookInterface } from '../demo'
import { TestHelpers } from '@awell-health/extensions-core'
describe('demo - webhook', () => {
  const {
    extensionWebhook: demo,
    onSuccess,
    onError,
    helpers,
    clearMocks,
  } = TestHelpers.fromWebhook(webhookInterface)

  beforeEach(() => {
    clearMocks()
  })

  it('Should call onSuccess', async () => {
    const payload = {
      eventType: 'someEventType',
      hello: 'Some text',
    }
    const settings = {
      secret: '123',
    }
    const headers = {
      'x-signing-secret': '123',
    }
    await demo.onEvent({
      payload: { payload, headers, settings } as any,
      onSuccess,
      onError,
      helpers,
    })
    expect(onSuccess).toHaveBeenCalledWith({
      data_points: payload,
    })
  })
  it('Should call onError if no signing secret', async () => {
    const payload = {
      eventType: 'someEventType',
      hello: 'Some text',
    }
    const settings = {
      secret: undefined,
    }
    const headers = {
      'x-signing-secret': '123',
    }
    await demo.onEvent({
      payload: { payload, headers, settings } as any,
      onSuccess,
      onError,
      helpers,
    })
    expect(onError).toHaveBeenCalledWith({
      response: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    })
  })
})
