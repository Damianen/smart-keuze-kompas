const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Module Detail Page - Live Backend', () => {
  before(() => {
    if (!testUser.email || !testUser.password) {
      cy.log('Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in cypress.env.json');
    }
  });

  beforeEach(function () {
    if (!testUser.email || !testUser.password) {
      this.skip();
    }

    cy.intercept('GET', '**/api/keuzemodules/getAll').as('getAllModules');
    cy.intercept('GET', '**/api/keuzemodules/*').as('getModule');

    cy.login(testUser.email, testUser.password);
    cy.visit('/modules');
    cy.wait('@getAllModules', { timeout: 60000 });
  });

  it('should navigate to module detail page when clicking a module', () => {
    // Click on the first module's view details button (NL: "Bekijk details", EN: "View details")
    cy.get('article').first().within(() => {
      cy.contains(/Bekijk details|View details/).click();
    });

    // Should be on a module detail page
    cy.url().should('match', /\/modules\/\d+/);
  });

  it('should display module information on detail page', () => {
    // Click on the first module
    cy.get('article').first().within(() => {
      cy.contains(/Bekijk details|View details/).click();
    });

    cy.wait('@getModule', { timeout: 60000 });

    // Check for module detail content (NL: "Over deze module", EN: "About this module")
    cy.contains(/Over deze module|About this module/).should('be.visible');
  });

  it('should have a back button on detail page', () => {
    // Click on the first module
    cy.get('article').first().within(() => {
      cy.contains(/Bekijk details|View details/).click();
    });

    cy.wait('@getModule', { timeout: 60000 });

    // Check for back button (NL: "Terug naar overzicht", EN: "Back to overview")
    cy.contains(/Terug naar overzicht|Back to overview/).should('be.visible');
  });

  it('should navigate back when clicking back button', () => {
    // Click on the first module
    cy.get('article').first().within(() => {
      cy.contains(/Bekijk details|View details/).click();
    });

    cy.wait('@getModule', { timeout: 60000 });

    // Click back button
    cy.contains(/Terug naar overzicht|Back to overview/).click();

    // Should be back on modules page
    cy.url().should('include', '/modules');
    cy.url().should('not.match', /\/modules\/\d+/);
  });

  it('should display learning goals section', () => {
    // Click on the first module
    cy.get('article').first().within(() => {
      cy.contains(/Bekijk details|View details/).click();
    });

    cy.wait('@getModule', { timeout: 60000 });

    // Check for learning goals section (NL: "Leerdoelen", EN: "Learning Goals")
    cy.contains(/Leerdoelen|Learning Goals/).should('be.visible');
  });
});
