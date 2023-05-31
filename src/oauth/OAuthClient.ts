import { cache } from '@awell-health/extensions-core'
import * as Axios from 'axios'
import { createHash } from 'node:crypto'
import {
  type OAuthAccessTokenResponse,
  type OAuthGrantRequest,
  type OAuthOpts,
} from './OAuth'

/**
 * Supported OAuth Grant Types:
 * - Client Credentials
 * - Password Grant
 *
 * ### How to use
 *
 * Extend this class and define a custom contructor to configure the authentication
 * server url, the grant type, the cache service to use and the API server URL.
 * ```
 * class MyAPIClient {
 *   auth: OAuthClient
 *   // See: https://developers.awellhealth.com/awell-extensions/docs/getting-started/store-secrets
 *   public constructor(
 *     client_id: string,
 *     client_secret: string,
 *     auth_url: string,
 *     api_base_url: string
 *   ) {
 *     const grantRequest: OAuthGrantRequest = {
 *       client_id,
 *       client_secret,
 *       grant_type: 'client_credentials',
 *     }
 *     this.auth = new OAuthClient({
 *       grantRequest,
 *       url: auth_url
 *     })
 *   }
 * }
 * ```
 */
export class OAuthClient {
  readonly grant: OAuthGrantRequest
  readonly cacheService: cache.CacheService<string>
  readonly client: Axios.AxiosInstance
  private readonly cache_key: string

  public constructor({ grant, cacheService, url }: OAuthOpts) {
    this.grant = grant

    this.cacheService = cacheService ?? new cache.NoCache()

    this.cache_key = createHash('sha256')
      .update(JSON.stringify(this.grant))
      .digest('hex')

    const basicAuth = Buffer.from(
      `${this.grant.client_id}:${this.grant.client_secret}`
    ).toString('base64')

    this.client = Axios.default.create({
      baseURL: url,
      headers: {
        authorization: `Basic ${basicAuth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      validateStatus: (status) => {
        return status >= 200 && status < 300
      },
    })
  }

  protected async invalidateCachedToken(): Promise<void> {
    await this.cacheService.unset(this.cache_key)
  }

  private async getCachedToken(): Promise<string | null> {
    return await this.cacheService.get(this.cache_key)
  }

  private async storeToken(response: OAuthAccessTokenResponse): Promise<void> {
    await this.cacheService.set(
      this.cache_key,
      JSON.stringify(response),
      Date.now() + response.expires_in * 1000
    )
  }

  private async autorize(): Promise<OAuthAccessTokenResponse> {
    const response = await this.client.post<OAuthAccessTokenResponse>(
      '/',
      new URLSearchParams(Object.entries(this.grant)).toString()
    )
    await this.storeToken(response.data)
    return response.data
  }

  /**
   * Perform the OAuth grant to obtain an access and saves it in the cache if
   * a cache service is configured.
   *
   * Note that if caching is enabled this will first look for a token in the
   * cache.
   *
   * @returns the access token
   */
  public async getAccessToken(): Promise<string> {
    const cachedToken = await this.getCachedToken()
    if (cachedToken !== null) {
      const token = JSON.parse(cachedToken) as OAuthAccessTokenResponse
      return token.access_token
    }

    const token = await this.autorize()
    return token.access_token
  }
}
