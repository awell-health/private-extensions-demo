import { type OAuthGrantClientCredentialsRequest } from '../../oauth'
import { GraphqlClient } from '../GraphqlClient'

const grant: OAuthGrantClientCredentialsRequest = {
  client_id: 'demo-backend-client',
  client_secret: 'MJlO3binatD9jk1',
  grant_type: 'client_credentials',
}

const apiConfig = {
  grant,
  auth_url: 'https://login-demo.curity.io/oauth/v2/oauth-token',
  api_url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
}

test('Should get an access token using the client credentials grant', async () => {
  const client = new GraphqlClient(apiConfig)
  const authorize = jest.spyOn(client, 'authorizeClient')
  await client.getAllFilms()
  expect(authorize).toHaveBeenCalled()
})

test('Should set the access token in the request header', async () => {
  const client = new GraphqlClient(apiConfig)
  const setHeader = jest.spyOn(client.client, 'setHeader')
  await client.getAllFilms()
  expect(setHeader).toHaveBeenCalledWith(
    'Authorization',
    expect.stringMatching('Bearer')
  )
})

test('Should successfully call the get all films query', async () => {
  const client = new GraphqlClient(apiConfig)
  const response = await client.getAllFilms()
  console.log(response)
  expect(response).toBeDefined()
})
