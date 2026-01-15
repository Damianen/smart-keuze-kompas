const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: 'amineachouche20077@gmail.com',
  password: 'AmineAchouche1',
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
    cy.contains('Hi,').should('be.visible');
    cy.contains('Uitloggen').click();

    cy.wait('@logout', { timeout: 60000 });
    cy.wait(1000);

    cy.url({ timeout: 10000 }).should('match', /\/(login)?$/);
  });

  it('should not access protected routes after logout', () => {
    cy.contains('Uitloggen').click();
    cy.wait('@logout', { timeout: 60000 });
    cy.wait(1000);

    cy.visit(`${BASE_URL}/modules`);
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
