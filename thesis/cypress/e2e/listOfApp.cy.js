describe("ListOfApp Page Tests", () => {
  const baseUrl =
    "http://localhost:3000/appointmentsTable/wqC99OKSwNQGkNZIqmbNapuMFsf1";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders Menu item Home", () => {
    cy.contains("Home").should("be.visible");
  });

  it("renders Menu item Upcoming Appointments", () => {
    cy.contains("Upcoming Appointments").should("be.visible");
  });

  it("renders Menu item Set Availability", () => {
    cy.contains("Set Availability").should("be.visible");
  });

  it("renders Menu item List of Appointments", () => {
    cy.contains("List of Appointments").should("be.visible");
  });

  it("renders Menu item Register Patient", () => {
    cy.contains("Register Patient").should("be.visible");
  });

  it("renders Menu button Show Details", () => {
    cy.get("button").contains("Show Details").should("be.visible");
  });

  it("renders Menu button Logout", () => {
    cy.get("button").contains("Logout").should("be.visible");
  });

  it("renders List of Appointments section", () => {
    cy.contains("List of Appointments").should("be.visible");
  });
});
