describe("RegisterDoc Tests", () => {
  const baseUrl = "http://localhost:3000/registerdoc";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders the necessary fields", () => {
    cy.get('[data-testid="personalID"]').should("exist");
    cy.get('[data-testid="name"]').should("exist");
    cy.get('[data-testid="surname"]').should("exist");
    cy.get('[data-testid="clinic"]').should("exist");
    cy.get('[data-testid="specialization"]').should("exist");
    cy.get('[data-testid="date"]').should("exist");
    cy.get('[data-testid="gender"]').should("exist");
    cy.get('[data-testid="address"]').should("exist");
    cy.get('[data-testid="phone"]').should("exist");
    cy.get('[data-testid="email"]').should("exist");
    cy.get('[data-testid="password"]').should("exist");
    cy.get('[data-testid="confirmPassword"]').should("exist");
    cy.get('[data-testid="submit"]').should("exist");
  });

  it("allows user to enter details", () => {
    cy.get('[data-testid="personalID"]').type("12345");
    cy.get('[data-testid="name"]').type("John");
    cy.get('[data-testid="surname"]').type("Doe");
    cy.get('[data-testid="clinic"]').type("Ambulance");
    cy.get('[data-testid="email"]').type("john.doe@example.com");
    cy.get('[data-testid="password"]').type("Secure123");
    cy.get('[data-testid="confirmPassword"]').type("Secure123");

    cy.get('[data-testid="personalID"]').should("have.value", "12345");
    cy.get('[data-testid="name"]').should("have.value", "John");
  });

  it("submits the form successfully", () => {
    cy.get('[data-testid="personalID"]').type("12345");
    cy.get('[data-testid="name"]').type("John");

    cy.get('[data-testid="submit"]').click();
  });
});
