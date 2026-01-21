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

    // Check for password mismatch error (NL: "Wachtwoorden komen niet overeen", EN: "Passwords do not match")
    cy.contains(/Wachtwoorden komen niet overeen|Passwords do not match/, { timeout: 5000 }).should('be.visible');
  });

  it('should have a link to login page', () => {
    cy.visit(`${BASE_URL}/register`);
    // Click login link (NL: "Log in", EN: "Log in")
    cy.contains('Log in').click();
    cy.url().should('include', '/login');
  });

  it('should show validation error for missing required fields', () => {
    cy.visit(`${BASE_URL}/register`);

    // Only fill some fields
    cy.get('#name').type(testUser.name);
    cy.get('#email').type(testUser.email);

    cy.get('button[type="submit"]').click();

    // Check for required fields error (NL: "Vul alle verplichte velden in", EN: "Please fill in all required fields")
    cy.contains(/Vul alle verplichte velden in|Please fill in all required fields/, { timeout: 5000 }).should('be.visible');
  });

  it('should show validation error for short password', () => {
    cy.visit(`${BASE_URL}/register`);

    cy.get('#name').type(testUser.name);
    cy.get('#surname').type(testUser.surname);
    cy.get('#email').type(testUser.email);
    cy.get('#birthDate').type(testUser.birthDate);
    cy.get('#password').type('short');
    cy.get('#confirmPassword').type('short');

    cy.get('button[type="submit"]').click();

    // Check for short password error (NL: "Wachtwoord moet minimaal 8 tekens bevatten", EN: "Password must be at least 8 characters")
    cy.contains(/Wachtwoord moet minimaal 8 tekens bevatten|Password must be at least 8 characters/, { timeout: 5000 }).should('be.visible');
  });
});
