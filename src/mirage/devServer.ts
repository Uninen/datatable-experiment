import { Server, Model, Factory, Collection, Request, ModelInstance } from 'miragejs'
import Schema from 'miragejs/orm/schema'
import { AnyRegistry } from 'miragejs/-types'

import faker from 'faker'
import MiniSearch from 'minisearch'

import artistsJson from './fixtures/artists.mirage.db.json'
import { sortByKey } from '../components/datatable/utils'
import { debug } from '../components/datatable/utils/dev'

faker.seed(2020)

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
  filters: any[]
}

function requestData(request: any): requestDataModel {
  const page = parseInt(request.queryParams.page) || 1
  const perPage = parseInt(request.queryParams.limit) || 30
  const ordering = request.queryParams.ordering || null
  const end = perPage * page
  const start = end - perPage
  let filters: any[] = []

  delete request.queryParams.page
  delete request.queryParams.limit
  delete request.queryParams.ordering

  // console.log('MIRAGE *** REQUEST *** ', request.queryParams)
  for (let [key, value] of Object.entries(request.queryParams)) {
    if (key !== 'search') {
      console.log('adding filter for', key)
      if (value === 'true') {
        value = true
      }
      if (value === 'false') {
        value = false
      }
      filters.push({
        property: key,
        value: value,
      })
    }
  }

  return {
    page,
    perPage,
    ordering,
    end,
    start,
    filters,
  }
}

// @ts-ignore
function responseFromResults(rd: requestDataModel, results: Collection) {
  if (rd.ordering) {
    // console.log('sorting results by field: ', ordering)
    results.sort(sortByKey(rd.ordering))
  }
  return results.slice(rd.start, rd.end)
}

function allData(schema: Schema<AnyRegistry>, model: string, request: Request): allDataModel {
  const rd = requestData(request)

  let results = schema.all(model).models
  if (rd.filters.length > 0) {
    for (const filterObj of rd.filters) {
      results = results.filter((item: any) => item[filterObj.property] === filterObj.value)
    }
  }
  const count: number = results.length

  return {
    count,
    results: responseFromResults(rd, results),
  }
}

function searchData(
  schema: Schema<AnyRegistry>,
  model: string,
  request: Request,
  searchInstance: MiniSearch
): allDataModel {
  const rd = requestData(request)
  const searchTerm: string | null = request.queryParams.search || null
  let results: any[] = []

  if (searchInstance.documentCount === 0) {
    searchInstance.addAll(schema.all(model).models)
  }

  if (searchTerm !== null && searchTerm.length > 0) {
    let searchResults = searchInstance.search(searchTerm)
    let tmpResults: ModelInstance<{}>[] = []

    if (searchResults.length > 0) {
      for (const resultObj of searchResults) {
        let res = schema.all(model).models.find((obj: any) => {
          return obj.id === resultObj.id
        }) as ModelInstance<{}>

        tmpResults.push(res)
      }
      results = tmpResults
    }
  }

  if (rd.filters.length > 0) {
    for (const filterObj of rd.filters) {
      results = results.filter((item: any) => item[filterObj.property] === filterObj.value)
    }
  }

  const count: number = results.length
  return {
    count,
    results: responseFromResults(rd, results),
  }
}

export function makeDevServer(environment = 'test') {
  const searchInstance = new MiniSearch({
    fields: ['name', 'username'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
    },
  })

  const server = new Server({
    routes() {
      this.get(
        '/api/search/artists',
        (schema, request) => {
          const ad = searchData(schema, 'artist', request, searchInstance)
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

        email() {
          return faker.internet.exampleEmail()
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

        boringField() {
          return faker.random.number(5)
        },
      }),
    },

    seeds(server) {
      // @ts-ignore
      if (environment === 'test') {
        debug.log('MirageJS: loading artists from JSON')
        server.db.loadData(artistsJson)
      } else {
        debug.log('MirageJS: loading artists dynamically')
        server.createList('artist', 500)
      }
    },
  })
  // @ts-ignore
  window.mirageServer = server

  return server
}
