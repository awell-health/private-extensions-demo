import { apiClient } from '../apiClient'

describe('Client credentials flow', () => {
  test('Should get an initial token', async () => {
    const response = await apiClient.introspect()
    console.log(response)
    expect(response).toBeDefined()
  })
})
