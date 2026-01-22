const testUser = {
  email: Cypress.env('TEST_USER_EMAIL'),
  password: Cypress.env('TEST_USER_PASSWORD'),
};

const selectFirstOptionIfAny = (selector) => {
  cy.get(selector).then(($select) => {
    const options = $select.find('option');
    const firstValue = options.length > 1 ? options.eq(1).val() : null;
    if (firstValue) {
      cy.wrap($select).select(firstValue, { force: true });
    }
  });
};

describe('Modules filters (lokale frontend, online backend)', () => {
  before(() => {
    if (!testUser.email || !testUser.password) {
      cy.log('Skipping: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in cypress.env.json');
    }
  });

  it('kan zoeken, niveau/locatie kiezen en filters wissen', function () {
    if (!testUser.email || !testUser.password) {
      this.skip();
    }
    cy.intercept('POST', '**/api/auth/login').as('login');
    cy.intercept('GET', '**/api/keuzemodules/getAll').as('getAllModules');
    cy.intercept('GET', '**/api/keuzemodules/search*').as('searchModules');

    cy.visit('/login');
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password, { log: false });
    cy.get('button[type="submit"]').click();

    cy.wait('@login', { timeout: 60000 });
    cy.url({ timeout: 60000 }).should('include', '/modules');
    cy.wait('@getAllModules', { timeout: 60000 });

    cy.get('#search').type('AI');
    cy.wait(1000);

    selectFirstOptionIfAny('#level');
    cy.wait(500);

    selectFirstOptionIfAny('#location');
    cy.wait(500);

    // Click clear filters button (NL: "Wis filters", EN: "Clear filters")
    cy.contains(/Wis filters|Clear filters/).click();
    cy.wait(500);

    cy.get('#search').should('have.value', '');
    cy.get('#level').should('have.value', '');
    cy.get('#location').should('have.value', '');
  });
});
