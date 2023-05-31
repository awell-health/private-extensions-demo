import { type OAuthGrantClientCredentialsRequest } from '../../oauth'
import { RestClient } from '../RestClient'

const grant: OAuthGrantClientCredentialsRequest = {
  client_id: 'demo-backend-client',
  client_secret: 'MJlO3binatD9jk1',
  grant_type: 'client_credentials',
}

const apiConfig = {
  grant,
  auth_url: 'https://login-demo.curity.io/oauth/v2/oauth-token',
  api_url: 'https://login-demo.curity.io/oauth/v2/',
}

test('Should get an access token using the client credentials grant', async () => {
  const client = new RestClient(apiConfig)
  const interceptor = client.client.interceptors.request.use((config) => {
    expect(config.headers.Authorization).toBeDefined()
    return config
  })
  await client.introspect()
  client.client.interceptors.request.eject(interceptor)
})

test('Should successfully call the introspection endpoint', async () => {
  const client = new RestClient(apiConfig)
  const response = await client.introspect()
  expect(response).toBeDefined()
})
