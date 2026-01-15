const BASE_URL = 'http://localhost:4200';

const testUser = {
  name: 'Cypress',
  surname: 'Test',
  email: `cypress-test-${Date.now()}@test.com`,
  birthDate: '2000-01-01',
  password: 'TestPassword123',
};

describe('Register Flow - Live Backend', () => {
  it('should show validation error for mismatched passwords', () => {
    cy.visit(`${BASE_URL}/register`);

    cy.get('#name').type(testUser.name);
    cy.get('#surname').type(testUser.surname);
    cy.get('#email').type(testUser.email);
    cy.get('#birthDate').type(testUser.birthDate);
    cy.get('#password').type(testUser.password);
    cy.get('#confirmPassword').type('DifferentPassword123');

    cy.get('button[type="submit"]').click();

    cy.contains('Wachtwoorden komen niet overeen', { timeout: 5000 }).should('be.visible');
  });

  it('should have a link to login page', () => {
    cy.visit(`${BASE_URL}/register`);
    cy.contains('Log in').click();
    cy.url().should('include', '/login');
  });
});
