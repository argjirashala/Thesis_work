describe("AllBookedApp Page Tests", () => {
  const baseUrl =
    "http://localhost:3000/bookedappointments/eQ40A7fYIReYlqggSMhbTCt5viE2";

  beforeEach(() => {
    cy.visit(baseUrl);
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

  it("renders Booked appointments section", () => {
    cy.get("h2, h3, h4").contains("Booked Appointments").should("be.visible");
  });
});
