import { cache } from '@awell-health/extensions-core'
import * as Axios from 'axios'
import { createHash } from 'node:crypto'
import {
  type OAuthAccessTokenResponse,
  type OAuthGrantRequest,
  type OAuthOpts,
} from './OAuth'

type Logger = typeof console

export interface OAuthApiClientOpts {
  auth: OAuthOpts
  api: {
    baseURL: string
  }
  log?: Logger
}

export class OAuthApiClient {
  readonly grantRequest: OAuthGrantRequest
  readonly cacheService: cache.CacheService<string>
  readonly authClient: Axios.AxiosInstance
  client: Axios.AxiosInstance
  private readonly cache_key: string
  private readonly log: Logger

  public constructor({
    auth: { grantRequest, cacheService, url },
    api,
    log = console,
  }: OAuthApiClientOpts) {
    this.grantRequest = { ...grantRequest }
    this.log = log

    this.cacheService = cacheService ?? new cache.NoCache()

    this.cache_key = createHash('sha256')
      .update(JSON.stringify(grantRequest))
      .digest('hex')

    const basicAuth = Buffer.from(
      `${grantRequest.client_id}:${grantRequest.client_secret}`
    ).toString('base64')

    this.authClient = Axios.default.create({
      baseURL: url,
      headers: {
        authorization: `Basic ${basicAuth}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      validateStatus: (status) => {
        return status >= 200 && status < 300
      },
    })
    this.client = Axios.default.create({
      baseURL: api.baseURL,
    })
  }

  /**
   * OAuth related methods
   */

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
    const response = await this.authClient.post<OAuthAccessTokenResponse>(
      '/',
      new URLSearchParams(Object.entries(this.grantRequest)).toString()
    )
    await this.storeToken(response.data)
    return response.data
  }

  protected async autorizeClient(): Promise<string> {
    const cachedToken = await this.getCachedToken()
    if (cachedToken !== null) {
      const token = JSON.parse(cachedToken) as OAuthAccessTokenResponse
      return token.access_token
    }

    const token = await this.autorize()
    this.client.defaults.headers.Authorization = `Bearer ${token.access_token}`
    return token.access_token
  }
}
