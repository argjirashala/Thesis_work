describe("ListOfPat Tests", () => {
  const baseUrl = "http://localhost:3000/patienttable";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders without crashing", () => {
    cy.contains("Patients").should("be.visible");
  });

  it("renders List of Doctors menu item", () => {
    cy.contains("List of Doctors").should("be.visible");
  });

  it("renders List of Patients menu item", () => {
    cy.contains("List of Patients").should("be.visible");
  });

  it("renders Logout button", () => {
    cy.contains("button", "Logout").should("be.visible");
  });

  it("renders Register Patient menu item", () => {
    cy.contains("Register Patient").should("be.visible");
  });

  it("renders Register Doctor menu item", () => {
    cy.contains("Register Doctor").should("be.visible");
  });

  it("displays patients data", () => {
    const mockPatients = [
      {
        name: "Argjira",
        surname: "Shala",
        email: "argjirashala9@gmail.com",
      },
    ];

    mockPatients.forEach((patient) => {
      cy.contains(patient.name).should("be.visible");
      cy.contains(patient.surname).should("be.visible");
      cy.contains(patient.email).should("be.visible");
    });
  });
});
