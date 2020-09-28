import { Server, Model, Factory, Collection, Request } from 'miragejs'
import Schema from 'miragejs/orm/schema'
import { AnyRegistry } from 'miragejs/-types'
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

interface allDataModel {
  count: number
  results: number
}

interface requestDataModel {
  page: number
  perPage: number
  ordering: string | null
  end: number
  start: number
}

function requestData(request: any): requestDataModel {
  const page = parseInt(request.queryParams.page) || 1
  const perPage = parseInt(request.queryParams.limit) || 30
  const ordering = request.queryParams.ordering || null
  const end = perPage * page
  const start = end - perPage

  return {
    page,
    perPage,
    ordering,
    end,
    start,
  }
}

function responseFromResults(rd: requestDataModel, results: Collection) {
  if (rd.ordering) {
    // console.log('sorting results by field: ', ordering)
    results.sort(sortByKey(rd.ordering))
  }
  return results.slice(rd.start, rd.end)
}

function allData(schema: Schema<AnyRegistry>, model: string, request: Request): allDataModel {
  const rd = requestData(request)

  const count: number = schema.all(model).models.length
  let results = schema.all(model).models

  return {
    count,
    results: responseFromResults(rd, results),
  }
}

function searchData(
  schema: Schema<AnyRegistry>,
  model: string,
  properties: string[],
  request: Request
): allDataModel {
  const rd = requestData(request)
  const searchTerm: string | null = request.queryParams.search || null

  let results = schema.where(model, (obj: any) => {
    if (searchTerm !== null && searchTerm.length > 0) {
      for (const property of properties) {
        if (obj[property].toLowerCase().includes(searchTerm)) {
          return true
        }
      }
    }
    return false
  }).models
  const count: number = results.length

  return {
    count,
    results: responseFromResults(rd, results),
  }
}

export function makeDevServer(environment = 'test') {
  const server = new Server({
    routes() {
      this.get(
        '/api/search/artists',
        (schema, request) => {
          const ad = searchData(schema, 'artist', ['name', 'username'], request)
          return {
            count: ad.count,
            results: ad.results,
          }
        },
        { timing: 200 }
      )

      this.get(
        '/api/artists',
        (schema, request) => {
          const ad = allData(schema, 'artist', request)
          return {
            count: ad.count,
            results: ad.results,
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

        username() {
          return faker.internet.userName()
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
      if (environment === 'test') {
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
