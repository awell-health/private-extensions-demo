This is a sample repository that shows how to create a private extension in the Awell ecosystem. A private extension is available to your account, so it only shows up for your care flows / users.

# What's included

- A sample hello world extension with a single log action
- Sample Rest & GraphQL API clients with built in support for OAuth and token caching, see `src/api`

# Instructions

1. Create a new repository, using this respository as the template
2. Update the fields in `src/index.ts` in the new repository. _The key must be unique inside of Awell._
3. **IMPORTANT: Don't forget to also change the category from `DEMO` to something else**
4. Update the name of the repository in package.json so an appropriate npm package can be built.
5. Create your actions, including any required configured fields and datapoints
6. Merge into main in order to publish your changes to the extension server.
