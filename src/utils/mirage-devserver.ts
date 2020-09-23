import { Server, Model, Factory } from 'miragejs'
import faker from 'faker'

import { sortByKey } from '../components/datatable/utils'

export function makeServer() {
  new Server({
    routes() {
      this.get('/api/artists', (schema, request) => {
        const page = parseInt(request.queryParams.page) || 1
        const perPage = parseInt(request.queryParams.limit) || 30
        const ordering = request.queryParams.ordering || null

        let end = perPage * page
        let start = end - perPage
        const count = schema.all('artist').models.length
        let results = schema.all('artist').models
        if (ordering) {
          console.log('sorting results by field: ', ordering)
          results.sort(sortByKey(ordering))
        }
        results = results.slice(start, end)
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
