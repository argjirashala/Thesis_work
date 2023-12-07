describe("AdminPage Tests", () => {
  const baseUrl = "http://localhost:3000/indexAdmin";

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("renders without crashing", () => {
    cy.contains("Doctors").should("be.visible");
  });

  it("renders List Of Doctors menu item", () => {
    cy.contains("List Of Doctors").should("be.visible");
  });

  it("renders List Of Patients menu item", () => {
    cy.contains("List Of Patients").should("be.visible");
  });

  it("renders Register Patient menu item", () => {
    cy.contains("Register Patient").should("be.visible");
  });

  it("renders Register Doctor menu item", () => {
    cy.contains("Register Doctor").should("be.visible");
  });

  it("renders Logout button", () => {
    cy.contains("button", "Logout").should("be.visible");
  });

  it("displays doctors data", () => {
    const mockDoctors = [
      {
        name: "Mentor",
        surname: "Shala",
        email: "mshala0501@gmail.com",
      },
    ];

    mockDoctors.forEach((doctor) => {
      cy.contains(doctor.name).should("be.visible");
      cy.contains(doctor.surname).should("be.visible");
      cy.contains(doctor.email).should("be.visible");
    });
  });
});
