describe("Patient Page Tests", () => {
  const baseUrl =
    "http://localhost:3000/indexPatient/eQ40A7fYIReYlqggSMhbTCt5viE2";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders Welcome message", () => {
    cy.contains("Welcome!").should("be.visible");
  });

  it("renders Logout button", () => {
    cy.contains("button", "Logout").should("be.visible");
  });

  it("renders ShowDetails button", () => {
    cy.contains("button", "Show Details").should("be.visible");
  });

  it("renders menu item Home", () => {
    cy.contains("Home").should("be.visible");
  });

  it("renders menu item Booked appointments", () => {
    cy.contains("Booked Appointments").should("be.visible");
  });

  it("renders menu item Finished appointments", () => {
    cy.contains("Finished Appointments").should("be.visible");
  });

  it("renders Select specialization", () => {
    cy.get("select").contains("--Select Specialization--").should("exist");
  });

  it("renders Book an appointment", () => {
    cy.contains("Book an appointment").should("be.visible");
  });
});
