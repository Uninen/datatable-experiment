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

    cy.get('.datatable-name').first().should('contain', 'Johnnie Batz')

    cy.get('#search').type('eva')

    cy.get('.datatable-name').first().should('contain', 'Evan Stamm')

    cy.contains('div', 'Showing 1 to 2 of 2 results')
  })
})
