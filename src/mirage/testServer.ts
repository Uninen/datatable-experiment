import { Server, Response } from 'miragejs'

export function makeTestServer() {
  const s = new Server({
    environment: 'test',
    routes() {
      const methods = ['get', 'put', 'patch', 'post', 'delete']
      methods.forEach((method) => {
        // @ts-ignore
        this[method]('/*', async (schema, request) => {
          // @ts-ignore
          const [status, headers, body] = await window.handleFromCypress(request)
          return new Response(status, headers, body)
        })
      })
    },
  })
  return s
}
