import { makeDevServer } from '../../../src/utils/mirage-dev-server'

describe('Test remote search', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('Search filter should work correctly', () => {
    cy.visit('/')

    cy.get('#search').type('eva')

    cy.contains('div', 'Showing 1 to 2 of 2 results')
  })
})
