describe("Doctor Page Tests", () => {
  const baseUrl =
    "http://localhost:3000/indexDoctor/wqC99OKSwNQGkNZIqmbNapuMFsf1";

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

  it("renders Menu item List Of Appointments", () => {
    cy.contains("List Of Appointments").should("be.visible");
  });

  it("renders Menu button Show Details", () => {
    cy.get("button").contains("Show Details").should("be.visible");
  });

  it("renders Welcome message", () => {
    cy.contains("Welcome").should("be.visible");
  });

  it("renders Logout button", () => {
    cy.get("button").contains("Logout").should("be.visible");
  });

  it("renders Register Patient button", () => {
    cy.contains("Register Patient").should("be.visible");
  });

  it("renders Show Details button", () => {
    cy.get("button").contains("Show Details").should("be.visible");
  });

  it("renders Today's Appointments", () => {
    cy.contains("Today's Appointments").should("be.visible");
  });
});
