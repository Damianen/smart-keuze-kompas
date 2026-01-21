const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Logout Flow - Live Backend', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('POST', '**/api/auth/logout').as('logout');

    cy.visit(`${BASE_URL}/login`);

    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@login', { timeout: 60000 });
    cy.url({ timeout: 10000 }).should('include', '/modules');
  });

  it('should successfully logout', () => {
    // Wait for navigation to be fully loaded with translations
    cy.get('nav').should('be.visible');
    // Look for the user greeting (works for both NL "Hi" and EN "Hi")
    cy.contains(/Hi,?\s/).should('be.visible');
    // Click logout button (NL: "Uitloggen", EN: "Logout")
    cy.get('button').contains(/Uitloggen|Logout/).click();

    cy.wait('@logout', { timeout: 60000 });
    cy.wait(1000);

    cy.url({ timeout: 10000 }).should('match', /\/(login)?$/);
  });

  it('should not access protected routes after logout', () => {
    // Click logout button (NL: "Uitloggen", EN: "Logout")
    cy.get('button').contains(/Uitloggen|Logout/).click();
    cy.wait('@logout', { timeout: 60000 });
    cy.wait(1000);

    cy.visit(`${BASE_URL}/modules`);
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
