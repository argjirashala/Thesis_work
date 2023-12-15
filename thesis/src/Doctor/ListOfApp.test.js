import React from "react";
import { cleanup, render, screen, userEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListOfApp from "./ListOfApp";
import { MemoryRouter, Route, Routes } from "react-router-dom";

test("renders Menu item Home", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});

test("renders Menu item Upcoming App", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
});

test("renders Menu item Set Availability", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Set Availability/i)).toBeInTheDocument();
});

test("renders Menu item List of App", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByText(/List of Appointments/i)[0]).toBeInTheDocument();
});

test("renders Menu item Register Patient", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Register Patient/i)).toBeInTheDocument();
});

test("renders Menu button show details", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );
  expect(
    screen.getByRole("button", { name: /Show Details/i })
  ).toBeInTheDocument();
});

test("renders Menu button logout", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
});

test("renders List of Patients", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<ListOfApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByText(/List of Appointments/i)[1]).toBeInTheDocument();
});
