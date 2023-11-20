import React from "react";
import { cleanup, render, screen, userEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DoctorPage from "./indexDoctor";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../../__mocks__/firebase/firestore");

describe("Doctor Page", () => {
  beforeEach(() => {
    jest.mock("../../__mocks__/firebase/firestore");
  });

  afterEach(() => {
    jest.unmock("../../__mocks__/firebase/firestore");
  });

  test("renders Menu item Home", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test("renders Menu item Upcoming App", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
  });

  test("renders Menu item Set Availability", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Set Availability/i)).toBeInTheDocument();
  });

  test("renders Menu item List of App", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/List Of Appointments/i)).toBeInTheDocument();
  });

  test("renders Menu item Register Patient", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Register Patient/i)).toBeInTheDocument();
  });

  test("renders Menu button show details", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: /Show Details/i })
    ).toBeInTheDocument();
  });

  test("renders Welcome message", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    const welcomeElement = screen.getByText(/Welcome/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  test("renders Logout button", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /Logout/ })).toBeInTheDocument();
  });

  test("renders Register Patient button", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Register Patient/i)).toBeInTheDocument();
  });

  test("renders ShowDetails button", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /Show Details/ })
    ).toBeInTheDocument();
  });

  test("renders Todays Appointments", async () => {
    render(
      <MemoryRouter initialEntries={["/doctor/1"]}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    const todaysAppointmentElement = screen.getByText(/Today's Appointments/i);
    expect(todaysAppointmentElement).toBeInTheDocument();
  });
});
