import { makeDevServer } from '../../../src/mirage/devServer'

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

  it('Search filter should work correctly with local data', () => {
    cy.visit('/local/')

    cy.get('.datatable-name').first().should('contain', 'Johnnie Batz')

    cy.get('#search').type('eva')
    cy.get('.datatable-name').first().should('contain', 'Evan Stamm')
    cy.contains('div', 'Showing 1 to 2 of 2 results')
  })

  it('Search with no results should say so with remote data', () => {
    cy.visit('/')

    cy.get('#search').type('batman')
    cy.contains('div', 'No results found.')
  })

  it('Search with no results should say so with local data', () => {
    cy.visit('/local/')

    cy.get('#search').type('batman')
    cy.contains('div', 'No results found.')
  })

  it('Searching remote data should return correct number of results', () => {
    cy.visit('/')

    cy.get('#search').type('ba')
    cy.contains('div', 'Showing 1 to 11 of 11 results')

    cy.get('#search').clear()

    cy.get('#search').type('bat')
    cy.contains('div', 'Showing 1 to 3 of 3 results')
  })

  it('Searching local data should return correct number of results', () => {
    cy.visit('/local/')

    cy.get('#search').type('ba')
    cy.contains('div', 'Showing 1 to 11 of 11 results')

    cy.get('#search').clear()

    cy.get('#search').type('bat')
    cy.contains('div', 'Showing 1 to 3 of 3 results')
  })
})
