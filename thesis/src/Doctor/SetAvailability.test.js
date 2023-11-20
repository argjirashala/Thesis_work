import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SetAvailability from "./SetAvailability";
import { MemoryRouter, Route, Routes } from "react-router-dom";

test("renders Menu item Home", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});

test("renders Menu item Set availibility", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Set Availability/i)).toBeInTheDocument();
});

test("renders Menu item Upcoming app", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
});

test("renders Menu item List of App", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/List Of Appointments/i)).toBeInTheDocument();
});

test("renders Menu item Register Patient", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Register Patient/i)).toBeInTheDocument();
});

test("renders Menu button show details", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
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
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
});

test("renders Set availability", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Set Your Availability/i)).toBeInTheDocument();
});

test("renders start time", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Start Time:/i)).toBeInTheDocument();
});

test("renders end time", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/End Time:/i)).toBeInTheDocument();
});

test("renders Add Slot", async () => {
  render(
    <MemoryRouter initialEntries={["/doctor/1"]}>
      <Routes>
        <Route path="/doctor/:userId" element={<SetAvailability />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole("button", { name: /Add Slot/i })).toBeInTheDocument();
});
