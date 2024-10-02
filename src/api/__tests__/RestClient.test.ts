import { api } from '../RestClient'
describe('get luke skywalker', () => {
  it('should return luke skywalker', async () => {
    const response = await api.getPerson(1)
    expect(response.name).toEqual('Luke Skywalker')
  })
})
