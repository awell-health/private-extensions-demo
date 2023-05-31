import { GraphQLClient } from 'graphql-request'
import { OAuthClient, type OAuthGrantRequest } from '../oauth'
import { getSdk } from './graphql-request'
import { cacheService } from './cacheService'

export class GraphqlClient {
  client: GraphQLClient
  auth: OAuthClient

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
    this.client = new GraphQLClient(api_url)
  }

  public async authorizeClient(): Promise<string> {
    const token = await this.auth.getAccessToken()
    this.client.setHeader('Authorization', `Bearer ${token}`)
    return token
  }

  public async getAllFilms(): Promise<any> {
    await this.authorizeClient()
    const sdk = getSdk(this.client)
    const { allFilms } = await sdk.allFilms()
    return allFilms
  }
}
