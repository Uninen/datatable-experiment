import { makeDevServer } from '../../../src/mirage/devServer'

describe('Test local filters', () => {
  let server: any

  beforeEach(() => {
    server = makeDevServer()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('Boolean filter should work correctly with local data', () => {
    cy.visit('/')

    cy.get('.datatable-name').first().should('contain', 'Jonathon McDermott')
    cy.get('input.localradio').eq(1).click()
    cy.get('.datatable-name').eq(0).should('contain', 'Jonathon McDermott')
    cy.get('.datatable-name').eq(1).should('contain', 'Mr. Yolanda Sipes')
    cy.contains('div', 'Showing 1 to 12 of 260 results')

    cy.get('input.localradio').eq(2).click()
    cy.get('.datatable-name').eq(0).should('contain', 'Ernestine Barton')
    cy.get('.datatable-name').eq(1).should('contain', 'Cathy Kihn')
    cy.contains('div', 'Showing 1 to 12 of 240 results')

    cy.get('input.localradio').eq(0).click()
    cy.get('.datatable-name').eq(0).should('contain', 'Jonathon McDermott')
    cy.contains('div', 'Showing 1 to 12 of 500 results')
  })
})
