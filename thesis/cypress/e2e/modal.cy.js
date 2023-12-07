describe("Modal Tests", () => {
  const baseUrl =
    "http://localhost:3000/finishedappointments/eQ40A7fYIReYlqggSMhbTCt5viE2";

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.contains("Show Diagnosis and Therapy").click();
  });

  it("should render diagnosis when modal is open", () => {
    cy.contains("Diagnosis: migraine").should("be.visible");
  });

  it("should render therapy when modal is open", () => {
    cy.contains("Therapy: Acetaminophen 3x1").should("be.visible");
  });

  it("should call onClose when the close button is clicked", () => {
    cy.contains("X").click();
    cy.contains("Diagnosis: Flu").should("not.exist");
  });

  it("should render an iframe if fileURL is provided", () => {
    cy.get("iframe").should("exist");
  });
});
