import { makeDevServer } from '../../../src/utils/mirage-dev-server'

describe('Test remote search', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('Search filter should work correctly with remote data', () => {
    cy.visit('/')

    cy.get('.datatable-name').first().should('contain', 'Johnnie Batz')

    cy.get('#search').type('eva')

    cy.get('.datatable-name').first().should('contain', 'Evan Stamm')

    cy.contains('div', 'Showing 1 to 2 of 2 results')
  })

  it('Searching remote data should return correct number of results', () => {
    cy.visit('/')

    cy.get('#search').type('mat')

    cy.contains('div', 'Showing 1 to 3 of 3 results')
  })

  it('Search filter should work correctly with local data', () => {
    cy.visit('/local/')

    cy.get('.datatable-name').first().should('contain', 'Johnnie Batz')

    cy.get('#search').type('eva')

    cy.get('.datatable-name').first().should('contain', 'Evan Stamm')

    cy.contains('div', 'Showing 1 to 2 of 2 results')
  })

  it('Search with no results should say so with remote data', () => {
    cy.visit('/')

    cy.get('#search').type('noresults')

    cy.contains('div', 'No results found.')
  })

  it('Search with no results should say so with local data', () => {
    cy.visit('/local/')

    cy.get('#search').type('noresults')

    cy.contains('div', 'No results found.')
  })
})
