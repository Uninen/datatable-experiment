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

  it('First artist name is visible on the page', () => {
    cy.visit('/')

    cy.contains('span', 'Johnnie Batz')
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
