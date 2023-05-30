import { type cache } from '@awell-health/extensions-core'

export interface OAuthGrantRequestBase {
  client_id: string
  client_secret: string
  scope?: string
}

export interface OAuthGrantPasswordRequest extends OAuthGrantRequestBase {
  username: string
  password: string
  grant_type: 'password'
}

export interface OAuthGrantClientCredentialsRequest
  extends OAuthGrantRequestBase {
  audience?: string
  grant_type: 'client_credentials'
}

export type OAuthGrantRequest =
  | OAuthGrantPasswordRequest
  | OAuthGrantClientCredentialsRequest

export interface OAuthRefreshTokenRequest {
  client_id: string
  client_secret: string
  refresh_token: string
  grant_type: 'refresh_token'
}

export interface OAuthAccessTokenResponse {
  token_type: string
  expires_in: number
  access_token: string
  scope: string
  refresh_token: string
}

export interface OAuthOpts {
  grantRequest: OAuthGrantRequest
  url: string
  cacheService?: cache.CacheService<string>
}
