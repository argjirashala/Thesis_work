describe("EditPatient Tests", () => {
  const baseUrl =
    "http://localhost:3000/editPatient/eQ40A7fYIReYlqggSMhbTCt5viE2";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders the necessary fields", () => {
    cy.get('[data-testid="testid"]').should("exist");
    cy.get('[data-testid="testname"]').should("exist");
    cy.get('[data-testid="surname"]').should("exist");
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
    cy.get('[data-testid="testid"]').type("12345");
    cy.get('[data-testid="testname"]').type("John");
    cy.get('[data-testid="surname"]').type("Doe");

    cy.get('[data-testid="testid"]').should("have.value", "12345");
    cy.get('[data-testid="testname"]').should("have.value", "John");
  });
});
