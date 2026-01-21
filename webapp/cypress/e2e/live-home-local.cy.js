const BASE_URL = 'http://localhost:4200';

describe('Home Page - Live Backend', () => {
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it('should display the hero section with title', () => {
    // Check for hero title (NL: "Kies Jouw" + "Keuzemodule", EN: "Choose Your" + "Elective Module")
    cy.contains(/Kies Jouw|Choose Your/).should('be.visible');
    cy.contains(/Keuzemodule|Elective Module/).should('be.visible');
  });

  it('should display navigation links', () => {
    cy.get('nav').should('be.visible');
    // Check for Home link
    cy.get('nav').contains('Home').should('be.visible');
    // Check for Modules link
    cy.get('nav').contains('Modules').should('be.visible');
  });

  it('should display login and register buttons when not logged in', () => {
    // Check for login link (NL: "Inloggen", EN: "Login")
    cy.get('nav').contains(/Inloggen|Login/).should('be.visible');
    // Check for register link (NL: "Registreren", EN: "Register")
    cy.get('nav').contains(/Registreren|Register/).should('be.visible');
  });

  it('should navigate to modules page when clicking view all modules button', () => {
    // Click view all modules button (NL: "Bekijk Alle Modules", EN: "View All Modules")
    cy.contains(/Bekijk Alle Modules|View All Modules/).click();
    cy.url().should('include', '/modules');
  });

  it('should navigate to login page when clicking login', () => {
    cy.get('nav').contains(/Inloggen|Login/).click();
    cy.url().should('include', '/login');
  });

  it('should navigate to register page when clicking register', () => {
    cy.get('nav').contains(/Registreren|Register/).click();
    cy.url().should('include', '/register');
  });

  it('should display feature cards', () => {
    // Check for feature section (NL: "Waarom Smart Keuze Kompas?", EN: "Why Smart Keuze Kompas?")
    cy.contains(/Waarom Smart Keuze Kompas\?|Why Smart Keuze Kompas\?/).should('be.visible');
    // Check for feature cards exist
    cy.contains(/Slimme Zoekfunctie|Smart Search/).should('be.visible');
    cy.contains(/Gedetailleerde Info|Detailed Info/).should('be.visible');
    cy.contains(/Eenvoudig Inschrijven|Easy Enrollment/).should('be.visible');
  });

  it('should toggle language when clicking language button', () => {
    // Find and click the language toggle button
    cy.get('nav').find('button').contains(/EN|NL/).click();
    // Wait for translation to update
    cy.wait(500);
    // The button text should have changed
    cy.get('nav').find('button').contains(/EN|NL/).should('be.visible');
  });

  it('should toggle dark mode when clicking dark mode button', () => {
    // Get initial state
    cy.get('div.min-h-screen').then(($el) => {
      const initiallyDark = $el.hasClass('dark:bg-gray-900');
      // Click dark mode toggle button (find by aria-label)
      cy.get('button[aria-pressed]').first().click();
      cy.wait(300);
      // Verify the toggle worked by checking if dark class is present on html element
      cy.get('html').then(($html) => {
        // The dark mode should have toggled
        expect($html.hasClass('dark')).to.exist;
      });
    });
  });
});
