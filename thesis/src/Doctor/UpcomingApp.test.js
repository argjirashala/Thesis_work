import React from "react";
import { cleanup, render, screen, userEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpcomingApp from "./UpcomingApp";
import { MemoryRouter, Route, Routes } from "react-router-dom";

test("renders Menu item Home", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});

test("renders Menu item Upcoming App", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByText(/Upcoming Appointments/i)[0]).toBeInTheDocument();
});

test("renders Menu item Set Availability", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Set Your Availability/i)).toBeInTheDocument();
});

test("renders Menu item List of App", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/List Of Appointments/i)).toBeInTheDocument();
});

test("renders Menu item Register Patient", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Register Patient/i)).toBeInTheDocument();
});

test("renders Menu button show details", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
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
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
});

test("renders Upcoming Appointments", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<UpcomingApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getAllByText(/Upcoming Appointments/i)[1]).toBeInTheDocument();
});
