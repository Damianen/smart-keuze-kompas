describe('Login Page Validation - Live Backend', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    // Check for login title
    cy.contains('Smart Keuze Kompas').should('be.visible');
    // Check for subtitle (NL: "Log in op je account", EN: "Log in to your account")
    cy.contains(/Log in op je account|Log in to your account/).should('be.visible');
  });

  it('should have email and password fields', () => {
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should have a submit button', () => {
    cy.get('button[type="submit"]').should('be.visible');
    // Check button text (NL: "Inloggen", EN: "Login")
    cy.get('button[type="submit"]').contains(/Inloggen|Login/).should('be.visible');
  });

  it('should have a link to register page', () => {
    // Check for register link (NL: "Registreer nu", EN: "Register now")
    cy.contains(/Registreer nu|Register now/).should('be.visible');
  });

  it('should navigate to register page when clicking register link', () => {
    cy.contains(/Registreer nu|Register now/).click();
    cy.url().should('include', '/register');
  });

  it('should not submit with empty fields', () => {
    cy.get('button[type="submit"]').click();
    // Should still be on login page (HTML5 validation prevents submission)
    cy.url().should('include', '/login');
  });

  it('should disable button and show loading state when submitting', () => {
    // Stub the API response with a long delay to observe the loading state
    cy.intercept('POST', '**/login', {
      delay: 5000,
      statusCode: 200,
      body: { success: false, message: 'Invalid credentials' },
    }).as('login');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check that button is disabled during loading (more reliable than checking text)
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
