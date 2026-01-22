const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Module Detail Page - Live Backend', () => {
  before(function () {
    if (!testUser.email || !testUser.password) {
      cy.log('Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in cypress.env.json');
      this.skip();
    }

    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('GET', '**/api/keuzemodules/getAll').as('getAllModules');

    // Login once for all tests
    cy.visit('/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password, { log: false });
    cy.get('button[type="submit"]').click();

    cy.wait('@login', { timeout: 60000 });
    cy.url({ timeout: 60000 }).should('include', '/modules');
    cy.wait('@getAllModules', { timeout: 60000 });
  });

  beforeEach(function () {
    if (!testUser.email || !testUser.password) {
      this.skip();
    }

    // Use regex to match only numeric IDs, not 'getAll'
    cy.intercept('GET', /\/api\/keuzemodules\/\d+$/).as('getModule');
  });

  it('should navigate to module detail page when clicking a module', () => {
    // Should already be on modules page from before() hook
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');

    // Click on the first module's view details button (NL: "Bekijk details", EN: "View details")
    cy.contains(/Bekijk details|View details/).first().click();

    // Should be on a module detail page
    cy.url().should('match', /\/modules\/\d+/);

    // Go back for next test
    cy.go('back');
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');
  });

  it('should display module information on detail page', () => {
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');

    // Click on the first module
    cy.contains(/Bekijk details|View details/).first().click();

    cy.wait('@getModule', { timeout: 60000 });

    // Check for module detail content (NL: "Over deze module", EN: "About this module")
    cy.contains(/Over deze module|About this module/).should('be.visible');

    // Go back for next test
    cy.go('back');
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');
  });

  it('should have a back button on detail page', () => {
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');

    // Click on the first module
    cy.contains(/Bekijk details|View details/).first().click();

    cy.wait('@getModule', { timeout: 60000 });

    // Check for back button (NL: "Terug naar overzicht", EN: "Back to overview")
    cy.contains(/Terug naar overzicht|Back to overview/).should('be.visible');

    // Go back for next test
    cy.go('back');
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');
  });

  it('should navigate back when clicking back button', () => {
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');

    // Click on the first module
    cy.contains(/Bekijk details|View details/).first().click();

    cy.wait('@getModule', { timeout: 60000 });

    // Click back button
    cy.contains(/Terug naar overzicht|Back to overview/).click();

    // Should be back on modules page
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');
  });

  it('should display learning goals section', () => {
    cy.url().should('match', /\/modules$/);
    cy.contains(/Bekijk details|View details/, { timeout: 60000 }).should('exist');

    // Click on the first module
    cy.contains(/Bekijk details|View details/).first().click();

    cy.wait('@getModule', { timeout: 60000 });

    // Check for learning goals section (NL: "Leerdoelen", EN: "Learning Goals")
    cy.contains(/Leerdoelen|Learning Goals/).should('be.visible');
  });
});
