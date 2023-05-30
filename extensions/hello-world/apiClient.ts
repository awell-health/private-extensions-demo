import { cache } from '@awell-health/extensions-core'
import {
  OAuthApiClient,
  type OAuthGrantClientCredentialsRequest,
} from '../oauth'

const cacheService = new cache.InMemoryCache()

class DemoAPIClient extends OAuthApiClient {
  public constructor() {
    const grantRequest: OAuthGrantClientCredentialsRequest = {
      client_id: 'demo-backend-client',
      client_secret: 'MJlO3binatD9jk1',
      grant_type: 'client_credentials',
    }
    super({
      auth: {
        grantRequest,
        url: 'https://login-demo.curity.io/oauth/v2/oauth-token',
        cacheService,
      },
      api: {
        baseURL: 'https://login-demo.curity.io/oauth/v2/',
      },
    })
  }

  public async introspect(): Promise<any> {
    const token = await this.autorizeClient()
    const response = await this.client.post(
      'oauth-introspect',
      new URLSearchParams({
        token,
        token_type_hint: 'access_token',
      }).toString(),
      {
        headers: {
          Authorization: 'Basic ZGVtby1nYXRld2F5OmJGZlVVU1ZzV3c4QVlj',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    return response.data
  }
}

export const apiClient = new DemoAPIClient()
