import AllBookedApp from "./AllBookedApp";
import React from 'react';
import { cleanup, render, screen,userEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

test('renders Logout button', async () => {
  render(
    <MemoryRouter initialEntries={['/patient/1']}>
      <Routes>
        <Route path="/patient/:userId" element={<AllBookedApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: /Logout/ })).toBeInTheDocument();
});

test('renders ShowDetails button', async () => {
  render(
    <MemoryRouter initialEntries={['/patient/1']}>
      <Routes>
        <Route path="/patient/:userId" element={<AllBookedApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: /Show Details/ })).toBeInTheDocument();
});


test('renders menu item Home', async () => {
  render(
    <MemoryRouter initialEntries={['/patient/1']}>
      <Routes>
        <Route path="/patient/:userId" element={<AllBookedApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Home/)).toBeInTheDocument();
});

test('renders menu item Booked appointments', async () => {
  render(
    <MemoryRouter initialEntries={['/patient/1']}>
      <Routes>
        <Route path="/patient/:userId" element={<AllBookedApp />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Booked appointments/)).toBeInTheDocument();
});

test('renders Booked appointments', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<AllBookedApp />} />
        </Routes>
      </MemoryRouter>
    );

    const bookAppointmentsElement = screen.getByText(/Your Booked Appointments/i);
    expect(bookAppointmentsElement).toBeInTheDocument();
  });