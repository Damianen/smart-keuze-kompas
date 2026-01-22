/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

/**
 * Login command with session caching to avoid repeated logins.
 * Sessions are cached per email, so subsequent calls with the same
 * email will restore the session instead of logging in again.
 */
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    [email],
    () => {
      cy.visit('/login');
      cy.get('input[name="email"]').should('be.visible').type(email);
      cy.get('input[name="password"]').type(password, { log: false });
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 60000 }).should('include', '/modules');
    },
    {
      validate: () => {
        cy.visit('/modules');
        cy.url({ timeout: 10000 }).should('include', '/modules');
      },
    }
  );
});