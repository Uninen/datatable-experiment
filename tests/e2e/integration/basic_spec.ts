// https://docs.cypress.io/api/introduction/api.html
import { makeDevServer } from '../../../src/utils/mirage-dev-server'

describe('Test remote stuff', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('shows correct artist names on the page', () => {
    cy.visit('/')

    cy.get('.datatable-name').first().should('contain', 'Johnnie Batz')
    cy.contains('div', 'Showing 1 to 12 of 180 results')
  })

  it('sorts the table by name', () => {
    cy.visit('/')

    // Sort by name
    cy.get('#sortby-name').click()
    cy.wait(300)
    cy.get('.datatable-name').first().should('contain', 'Al Bahringer')

    cy.get('#sortby-name').click()
    cy.wait(300)
    cy.get('.datatable-name').first().should('contain', 'Winston Bartell')

    cy.get('#sortby-name').click()
    cy.wait(300)
    cy.get('.datatable-name').first().should('contain', 'Johnnie Batz')

    // Sort by date
    cy.get('#sortby-created').click()
    cy.wait(300)
    cy.get('.datatable-name').first().should('contain', 'Brad Olson')
  })
})

describe('Test local stuff', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('First artist name is visible on the page', () => {
    cy.visit('/local/')

    cy.contains('td', 'Johnnie Batz')
  })
})
