const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Modules (lokale frontend, online backend)', () => {
  it('toont alle modules', () => {
    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('GET', '**/api/keuzemodules/getAll').as('getAllModules');

    cy.visit(`${BASE_URL}/login`);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password, { log: false });
    cy.get('button[type="submit"]').click();

    cy.wait('@login', { timeout: 60000 });
    cy.url({ timeout: 60000 }).should('include', '/modules');

    cy.wait('@getAllModules', { timeout: 60000 });

    // Check for modules page title (NL: "Keuzemodules", EN: "Elective Modules")
    cy.contains(/Keuzemodules|Elective Modules/).should('be.visible');
    cy.get('article').should('have.length.at.least', 1);
  });
});
