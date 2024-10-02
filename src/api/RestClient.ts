import {
  APIClient,
  DataWrapper,
  OAuth,
  type DataWrapperCtor,
  type OAuthGrantClientCredentialsRequest,
} from '@awell-health/extensions-core'

interface SWAPIPersonResponse {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  created: string
  edited: string
  url: string
}

export class SWAPIDataWrapper extends DataWrapper {
  public constructor(token: string, baseUrl: string) {
    super(token, baseUrl)
  }

  public async getPerson(id: number): Promise<SWAPIPersonResponse> {
    const res = await this.Request<SWAPIPersonResponse>({
      method: 'GET',
      url: `people/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return res
  }
}

/**
 * We've extended the OAuth class to include a resource property. While this
 * example is contrived, it demonstrates how you can extend the OAuth class to
 * include additional properties that are specific to your application.
 */
interface ExtendedAuth {
  resource: string
}
interface SWAPIProps {
  authUrl: string
  requestConfig: OAuthGrantClientCredentialsRequest<ExtendedAuth>
  baseUrl: string
}
class ExampleExtendedOAuth extends OAuth<ExtendedAuth> {}
const requestConfig: OAuthGrantClientCredentialsRequest<ExtendedAuth> = {
  client_id: 'demo-backend-client',
  client_secret: 'MJlO3binatD9jk1',
  grant_type: 'client_credentials',
  resource: 'example resource',
}

/**
 * There is no try, only do
 */
export class SWAPIClient extends APIClient<SWAPIDataWrapper> {
  readonly ctor: DataWrapperCtor<SWAPIDataWrapper> = (
    token: string,
    baseUrl: string
  ) => new SWAPIDataWrapper(token, baseUrl)

  public constructor({ authUrl, requestConfig, ...opts }: SWAPIProps) {
    super({
      ...opts,
      auth: new ExampleExtendedOAuth({
        auth_url: authUrl,
        request_config: requestConfig,
      }),
    })
  }

  public async getPerson(id: number): Promise<SWAPIPersonResponse> {
    return await this.FetchData(async (dw) => await dw.getPerson(id))
  }
}

// yeah, this auth url has nothing to do with the SWAPI...
const urlConfig = {
  authUrl: 'https://login-demo.curity.io/oauth/v2/oauth-token',
  baseUrl: 'https://swapi.dev/api/',
}
export const api = new SWAPIClient({
  requestConfig,
  ...urlConfig,
})
