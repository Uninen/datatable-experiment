// https://docs.cypress.io/api/introduction/api.html
import { makeDevServer } from '../../../src/mirage/devServer'

describe('Test responsivity', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('Show columns marked w/ hidden-below on large screens', () => {
    cy.viewport('macbook-13')
    cy.visit('/')
    cy.get('th').eq(1).should('contain', 'Subscription')
  })

  it('Hide columns marked w/ hidden-below on small screens', () => {
    cy.viewport('iphone-6')
    cy.visit('/')
    cy.get('th').eq(1).should('contain', 'VIP')
  })
})
