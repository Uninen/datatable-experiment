import { Server, Model, Factory } from 'miragejs'
import faker from 'faker'

export function makeServer() {
  new Server({
    routes() {
      this.get('/api/artists', (schema, request) => {
        let page = parseInt(request.queryParams.page) || 1
        let perPage = parseInt(request.queryParams.limit) || 30
        let end = perPage * page
        let start = end - perPage
        const count = schema.all('artist').models.length
        const results = schema.all('artist').models.slice(start, end)
        console.log('mirage per page: ', perPage)
        return {
          count,
          results,
        }
      })
    },

    models: {
      artist: Model,
    },

    factories: {
      artist: Factory.extend({
        name() {
          return faker.name.findName()
        },

        photo() {
          return faker.image.avatar()
        },

        eventsPlayed() {
          return faker.random.number(200)
        },

        subscriptionType(i: number) {
          const subs = [null, 'Pro', 'Rockstar', 'Superstar']
          return subs[i % subs.length]
        },

        isVip() {
          return faker.random.boolean()
        },

        created() {
          return faker.date.past()
        },
      }),
    },

    seeds(server) {
      server.createList('artist', 180)
    },
  })
}
