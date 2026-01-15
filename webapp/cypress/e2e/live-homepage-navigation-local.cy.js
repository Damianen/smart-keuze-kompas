const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Homepage Navigation - Live Backend', () => {
  it('should load homepage', () => {
    cy.visit(`${BASE_URL}/`);
    cy.contains('Smart Keuze Kompas', { timeout: 10000 }).should('be.visible');
    cy.contains('Kies Jouw', { timeout: 10000 }).should('be.visible');
  });

  it('should navigate to modules from Bekijk Alle Modules button', () => {
    cy.visit(`${BASE_URL}/`);
    cy.contains('Bekijk Alle Modules', { timeout: 10000 }).should('be.visible');
    cy.contains('Bekijk Alle Modules').click();
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('should show login in header when not authenticated', () => {
    cy.visit(`${BASE_URL}/`);
    cy.contains('Login', { timeout: 10000 }).should('be.visible');
    cy.contains('Registreer', { timeout: 10000 }).should('be.visible');
  });
});
