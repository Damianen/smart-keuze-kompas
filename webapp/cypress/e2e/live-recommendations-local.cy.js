const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Recommendations Flow - Live Backend', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('GET', '**/api/keuzemodules/getAll').as('getAllModules');
    cy.intercept('GET', '**/api/auth/user').as('authCheck');

    cy.visit(`${BASE_URL}/login`);

    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password, { log: false });
    cy.get('button[type="submit"]').click();

    cy.wait('@login', { timeout: 60000 });
    cy.url({ timeout: 60000 }).should('include', '/modules');
    cy.wait('@getAllModules', { timeout: 60000 });

    cy.wait(2000);

    cy.contains('Aanbevelingen', { timeout: 10000 }).should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/recommendations');
  });

  it('should load recommendations page after login', () => {
    cy.url({ timeout: 10000 }).should('include', '/recommendations');
    cy.contains('AI Aanbevelingen', { timeout: 10000 }).should('be.visible');
    cy.contains('Vertel ons over je interesses', { timeout: 10000 }).should('be.visible');
  });

  it('should get AI recommendations based on input', () => {
    const studentInput =
      'Ik ben geïnteresseerd in psychologie, coaching en zorg. Ik wil graag werken met mensen en hun gedrag begrijpen';
    cy.get('#studentInput', { timeout: 10000 }).should('be.visible').clear().type(studentInput);

    cy.contains('Krijg aanbevelingen', { timeout: 10000 }).should('be.visible').click();

    cy.get('article', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.contains('Waarom deze module?', { timeout: 10000 }).should('be.visible');
  });
});
