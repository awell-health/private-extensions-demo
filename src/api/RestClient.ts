import * as Axios from 'axios'
import { OAuthClient, type OAuthGrantRequest } from '../oauth'
import { cacheService } from './cacheService'

/**
 * This sample client uses a publicly available Curity Playground to illustrate
 * how to create an API client using a Client Credentials grant type and connect
 * it to your API.
 * See: https://oauth.tools/
 */
export class RestClient {
  auth: OAuthClient
  client: Axios.AxiosInstance
  public constructor({
    grant,
    auth_url,
    api_url,
  }: {
    grant: OAuthGrantRequest
    auth_url: string
    api_url: string
  }) {
    this.auth = new OAuthClient({
      grant,
      url: auth_url,
      cacheService,
    })
    this.client = Axios.default.create({
      baseURL: api_url,
    })
  }

  protected async authorizeClient(): Promise<string> {
    const token = await this.auth.getAccessToken()
    this.client.defaults.headers.Authorization = `Bearer ${token}`
    return token
  }

  public async introspect(): Promise<any> {
    const token = await this.authorizeClient()
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
