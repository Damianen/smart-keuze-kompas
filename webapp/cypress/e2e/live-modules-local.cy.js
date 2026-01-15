const BASE_URL = 'http://localhost:4200';

const testUser = {
  email: 'amineachouche20077@gmail.com',
  password: 'AmineAchouche1',
};

const selectFirstOptionIfAny = (selector) => {
  cy.get(selector).then(($select) => {
    const opts = $select.find('option');
    const firstValue = opts.length > 1 ? opts.eq(1).val() : null;
    if (firstValue) {
      cy.wrap($select).select(firstValue, { force: true });
    }
  });
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

    cy.contains('Keuzemodules').should('be.visible');
    cy.get('article').should('have.length.at.least', 1);
  });
});
