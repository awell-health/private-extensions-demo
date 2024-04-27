import {
  type Extension,
  Category,
  AuthorType,
} from '@awell-health/extensions-core'
import { log } from './actions'
import { settings } from './settings'
import { webhooks } from './webhooks'

const HelloWorld: Extension = {
  key: 'private-hello-world',
  title: 'Hello World!',
  description:
    'An example extension developers can look at to get started with building their first private extension.',
  icon_url:
    'https://res.cloudinary.com/da7x4rzl4/image/upload/v1678870116/Awell%20Extensions/Awell_Logo.png',
  category: Category.DEMO,
  author: {
    authorType: AuthorType.AWELL,
  },
  settings,
  actions: {
    log,
  },
  webhooks,
}

export default HelloWorld
