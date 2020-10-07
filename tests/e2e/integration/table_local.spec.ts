// https://docs.cypress.io/api/introduction/api.html
import { makeDevServer } from '../../../src/mirage/devServer'

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error')
})

describe('Test local table', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    cy.window().then((win) => {
      expect(win.console.error).to.have.callCount(0)
    })

    server.shutdown()
  })

  it('Show correct artist names', () => {
    cy.visit('/')

    cy.get('.datatable-name').first().should('contain', 'Jonathon McDermott')
    cy.contains('div', 'Showing 1 to 12 of 500 results')
  })

  it('Sort the table by name', () => {
    cy.visit('/')

    // Sort by name
    cy.get('#sortby-name').click()
    cy.get('.datatable-name').first().should('contain', 'Abraham Schultz')
    cy.get('#sortby-name').click()
    cy.get('.datatable-name').first().should('contain', 'Yvette Altenwerth')
    cy.get('#sortby-name').click()
    cy.get('.datatable-name').first().should('contain', 'Jonathon McDermott')

    // Sort by date
    cy.get('#sortby-created').click()
    cy.get('.datatable-name').first().should('contain', 'Melissa Hagenes')
  })
})
