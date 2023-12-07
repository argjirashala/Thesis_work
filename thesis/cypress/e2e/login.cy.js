describe("LoginPage Tests", () => {
  const baseUrl = "http://localhost:3000";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders email field", () => {
    cy.get('input[name="email"]').should("exist");
  });

  it("renders password field", () => {
    cy.get('input[name="password"]').should("exist");
  });

  it("renders login button", () => {
    cy.contains("button", "Login").should("exist");
  });

  it("renders forgot-password button", () => {
    cy.contains("button", "Forgot Password?").should("exist");
  });

  it("allows user to enter email", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="email"]').should("have.value", "test@example.com");
  });

  it("allows user to enter password", () => {
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="password"]').should("have.value", "password123");
  });

  it("calls signInWithEmailAndPassword on form submit", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.contains("button", "Login").click();
  });

  it("calls sendPasswordResetEmail when Forgot Password? button is clicked", () => {
    cy.get('input[name="email"]').type("test@example.com");
    cy.contains("button", "Forgot Password?").click();
  });
});
