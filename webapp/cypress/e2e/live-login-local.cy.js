const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

describe('Login via lokale frontend + online backend', () => {
  before(() => {
    if (!testUser.email || !testUser.password) {
      cy.log('Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in cypress.env.json');
    }
  });

  it('logt in en komt op modules', function () {
    if (!testUser.email || !testUser.password) {
      this.skip();
    }

    cy.visit(`${BASE_URL}/login`);

    cy.get('input[name="email"]').should('be.visible').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password, { log: false });
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 60000 }).should('include', '/modules');
  });
});
