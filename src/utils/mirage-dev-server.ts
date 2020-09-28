import { Server, Model, Factory } from 'miragejs'
import faker from 'faker'

import artistsJson from './fixtures/artists.mirage.db.json'
import { sortByKey } from '../components/datatable/utils'

export function downloadMirageJson() {
  // @ts-ignore
  const data = JSON.stringify(window.mirageServer.db.dump())
  var blob = new Blob([data], { type: 'text/json' }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')

  a.download = 'devserver.json'
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

export function makeDevServer(environment = 'test') {
  const server = new Server({
    routes() {
      this.get(
        '/api/artists',
        (schema, request) => {
          const page = parseInt(request.queryParams.page) || 1
          const perPage = parseInt(request.queryParams.limit) || 30
          const ordering = request.queryParams.ordering || null

          let end = perPage * page
          let start = end - perPage
          const count = schema.all('artist').models.length
          let results = schema.all('artist').models
          if (ordering) {
            // console.log('sorting results by field: ', ordering)
            results.sort(sortByKey(ordering))
          }
          results = results.slice(start, end)
          return {
            count,
            results,
          }
        },
        {
          timing: 200,
        }
      )
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
      // @ts-ignore
      if (environment !== 'dev') {
        console.info('MirageJS: loading artists from JSON: ', artistsJson)
        server.db.loadData(artistsJson)
      } else {
        console.info('MirageJS: loading artists dynamically.', environment)
        server.createList('artist', 180)
      }
    },
  })
  // @ts-ignore
  window.mirageServer = server

  return server
}
