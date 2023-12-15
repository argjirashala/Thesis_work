jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
}));

import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListOfPat from "./ListOfPat";
import { BrowserRouter as Router } from "react-router-dom";
import * as firebase from "firebase/firestore";
import { cleanup } from "@testing-library/react";

describe("ListOfPat", () => {
  const mockPatients = [
    {
      id: "1",
      name: "Patient1",
      surname: "Surname1",
      email: "patient1@email.com",
    },
  ];

  const mockDoctors = [
    {
      id: "1",
      name: "Doctor1",
      surname: "Surname1",
      email: "doctor1@email.com",
    },
  ];

  beforeEach(() => {
    firebase.getFirestore.mockReturnValue({});
    firebase.collection.mockReturnValue({});
    firebase.getDocs.mockResolvedValue({
      docs: mockDoctors.map((doc) => ({ id: doc.id, data: () => doc })),
    });
    firebase.doc.mockReturnValue({});
    firebase.deleteDoc.mockResolvedValue({});
    firebase.setDoc.mockResolvedValue({});

    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    const { getByText } = render(
      <Router>
        <ListOfPat />
      </Router>
    );
    expect(getByText("Patients")).toBeInTheDocument();
  });

  test("renders List of Doctors menu item", () => {
    const { getByText } = render(
      <Router>
        <ListOfPat />
      </Router>
    );
    expect(getByText("List of Doctors")).toBeInTheDocument();
  });

  test("renders List of Patients menu item", () => {
    const { getByText } = render(
      <Router>
        <ListOfPat />
      </Router>
    );
    expect(getByText("List of Patients")).toBeInTheDocument();
  });

  test("renders List of Patients menu item", () => {
    const { getByRole } = render(
      <Router>
        <ListOfPat />
      </Router>
    );
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  test("renders Register Patient menu item", () => {
    const { getByText } = render(
      <Router>
        <ListOfPat />
      </Router>
    );
    expect(getByText("Register Patient")).toBeInTheDocument();
  });

  test("renders Register Doctor menu item", () => {
    const { getByText } = render(
      <Router>
        <ListOfPat />
      </Router>
    );
    expect(getByText("Register Doctor")).toBeInTheDocument();
  });

  test("displays patients data", async () => {
    firebase.getDocs
      .mockResolvedValueOnce({
        docs: mockDoctors.map((doc) => ({
          id: doc.id,
          data: () => doc,
        })),
      })
      .mockResolvedValueOnce({
        docs: mockPatients.map((patient) => ({
          id: patient.id,
          data: () => patient,
        })),
      });

    render(
      <Router>
        <ListOfPat />
      </Router>
    );

    for (const patient of mockPatients) {
      await waitFor(() => {
        expect(screen.getAllByText(patient.name)[0]).toBeInTheDocument();
        expect(screen.getAllByText(patient.surname)[0]).toBeInTheDocument();
        expect(screen.getAllByText(patient.email)[0]).toBeInTheDocument();
      });
    }
  });

  afterEach(() => {
    cleanup();
  });
});
