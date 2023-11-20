jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterDoc from "./RegisterDoc";
import "@testing-library/jest-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as firebase from "firebase/firestore";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({})),
}));

describe("RegisterDoc", () => {
  beforeEach(() => {
    firebase.getFirestore.mockReturnValue({});
    firebase.collection.mockReturnValue({});
    firebase.doc.mockReturnValue({});
    firebase.deleteDoc.mockResolvedValue({});
    firebase.setDoc.mockResolvedValue({});

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders the personalId, name, surname field", () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );
    expect(screen.getByTestId("personalID")).toBeInTheDocument();
    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByTestId("surname")).toBeInTheDocument();
  });

  it("renders clinic and specialization", () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );
    expect(screen.getByTestId("clinic")).toBeInTheDocument();
    expect(screen.getByTestId("specialization")).toBeInTheDocument();
  });

  it("renders the date, gender, address, phone field", () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    expect(screen.getByTestId("date")).toBeInTheDocument();
    expect(screen.getByTestId("gender")).toBeInTheDocument();
    expect(screen.getByTestId("address")).toBeInTheDocument();
    expect(screen.getByTestId("phone")).toBeInTheDocument();
  });

  it("renders the email, passwor, confirmPassword", () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("confirmPassword")).toBeInTheDocument();
  });

  it("renders submit", () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );
    expect(screen.getByTestId("submit")).toBeInTheDocument();
  });

  it("can type personalID", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("personalID"), {
      target: { value: "12345" },
    });
    expect(await screen.getByTestId("personalID").value).toBe("12345");
  });

  it("can type name", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("name"), { target: { value: "John" } });
    expect(await screen.getByTestId("name").value).toBe("John");
  });

  it("can type name", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("surname"), {
      target: { value: "Doe" },
    });
    expect(await screen.getByTestId("surname").value).toBe("Doe");
  });

  it("can type date", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("date"), {
      target: { value: "1990-01-01" },
    });
    expect(await screen.getByTestId("date").value).toBe("1990-01-01");
  });

  it("can type gender", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("gender"), {
      target: { value: "male" },
    });
    expect(await screen.getByTestId("gender").value).toBe("male");
  });

  it("can type address", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("address"), {
      target: { value: "123 Main St" },
    });
    expect(await screen.getByTestId("address").value).toBe("123 Main St");
  });

  it("can type phone number", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "1234567890" },
    });
    expect(await screen.getByTestId("phone").value).toBe("1234567890");
  });

  it("can type clinic name", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("clinic"), {
      target: { value: "Ambulance" },
    });
    expect(await screen.getByTestId("clinic").value).toBe("Ambulance");
  });

  it("can type email", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "john.doe@example.com" },
    });
    expect(await screen.getByTestId("email").value).toBe(
      "john.doe@example.com"
    );
  });

  it("can type password", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Secure123" },
    });
    expect(await screen.getByTestId("password").value).toBe("Secure123");
  });

  it("can type confirm password", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "Secure123" },
    });
    expect(await screen.getByTestId("confirmPassword").value).toBe("Secure123");
  });

  it("shows error message when fields are empty and submit is clicked", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(
      await screen.findByText(/All fields must be filled!/i)
    ).toBeInTheDocument();
  });

  it("shows error message when password and confirm password do not match", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );
    fireEvent.change(await screen.getByTestId("password"), {
      target: { value: "Secure123" },
    });
    fireEvent.change(await screen.getByTestId("confirmPassword"), {
      target: { value: "Secure124" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(
      await screen.findByText(/Passwords do not match!/i)
    ).toBeInTheDocument();
  });

  it("shows an error when all fields are not filled", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    const submitButton = screen.getByTestId("submit");

    fireEvent.click(submitButton);

    expect(
      await screen.findByText("All fields must be filled!")
    ).toBeInTheDocument();
  });

  it("shows an error when name or surname contain non-letter characters", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    const nameInput = screen.getByTestId("name");
    const surnameInput = screen.getByTestId("surname");
    const submitButton = screen.getByTestId("submit");

    fireEvent.change(nameInput, { target: { value: "John123" } });
    fireEvent.change(surnameInput, { target: { value: "Doe!" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Name and surname should only contain letters")
    ).toBeInTheDocument();
  });

  it("shows an error when email format is invalid", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    const emailInput = screen.getByTestId("email");
    const submitButton = screen.getByTestId("submit");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("Invalid email format.")
    ).toBeInTheDocument();
  });

  it("shows an error when password format is invalid", async () => {
    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirmPassword");
    const submitButton = screen.getByTestId("submit");

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "short" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        "Password should be between 8 and 20 characters and contain at least one number."
      )
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "123" },
    });

    render(
      <Router>
        <RegisterDoc />
      </Router>
    );

    fireEvent.change(await screen.getByTestId("personalID"), {
      target: { value: "12345" },
    });
    fireEvent.change(await screen.getByTestId("name"), {
      target: { value: "John" },
    });
    fireEvent.change(await screen.getByTestId("confirmPassword"), {
      target: { value: "Secure123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));
  });
});
