const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Modules (lokale frontend, online backend)', () => {
  before(() => {
    if (!testUser.email || !testUser.password) {
      cy.log('Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in cypress.env.json');
    }
  });

  it('toont alle modules', function () {
    if (!testUser.email || !testUser.password) {
      this.skip();
    }
    cy.intercept('GET', '**/api/keuzemodules/getAll').as('getAllModules');

    cy.login(testUser.email, testUser.password);
    cy.visit('/modules');

    cy.wait('@getAllModules', { timeout: 60000 });

    // Check for modules page title (NL: "Keuzemodules", EN: "Elective Modules")
    cy.contains(/Keuzemodules|Elective Modules/).should('be.visible');
    cy.get('article').should('have.length.at.least', 1);
  });
});
