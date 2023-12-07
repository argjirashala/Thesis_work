describe("Logout Tests", () => {
  const baseUrl = "http://localhost:3000/logout";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders the logging out message and navigates to home after timeout", () => {
    cy.contains("Logging out...").should("be.visible");

    cy.wait(2000);

    cy.url().should("include", "/");
  });
});
