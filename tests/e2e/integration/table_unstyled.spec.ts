// https://docs.cypress.io/api/introduction/api.html
import { makeDevServer } from '../../../src/mirage/devServer'

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error')
  cy.spy(win.console, 'warn')
})

describe('Test unstyled table', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('First artist name is visible on the page', () => {
    cy.visit('/unstyled/')

    cy.contains('td', 'Johnnie Batz')
  })
})
