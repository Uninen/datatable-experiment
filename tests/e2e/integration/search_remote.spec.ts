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

    cy.get('.datatable-name').first().should('contain', 'Jonathon McDermott')
    cy.get('#search').type('eva')
    cy.get('.datatable-name').first().should('contain', 'Eva Zboncak')
    cy.contains('div', 'Showing 1 to 6 of 6 results')
  })

  it('Search with no results should say so with remote data', () => {
    cy.visit('/')

    cy.get('#search').type('batmannn')
    cy.contains('div', 'No results found.')
  })

  it('Searching remote data should return correct number of results', () => {
    cy.visit('/')

    cy.get('#search').type('ba')
    cy.contains('div', 'Showing 1 to 12 of 27 results')
    cy.get('#search').clear()
    cy.get('#search').type('bat')
    cy.contains('div', 'Showing 1 to 5 of 5 results')
  })
})
