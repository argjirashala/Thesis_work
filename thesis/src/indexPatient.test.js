import React from 'react';
import { cleanup, render, screen,userEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatientPage from './indexPatient';
import * as firebase from 'firebase/firestore';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../__mocks__/firebase/firestore');


describe('Patient Page', () => {
  beforeEach(() => {
    jest.mock('../__mocks__/firebase/firestore');
  });

  afterEach(() => {
    jest.unmock('../__mocks__/firebase/firestore');
  });

  test('renders Welcome message', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<PatientPage />} />
        </Routes>
      </MemoryRouter>
    );

    const welcomeElement = screen.getByText(/Welcome!/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  test('renders Logout button', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<PatientPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Logout/ })).toBeInTheDocument();
  });

  test('renders ShowDetails button', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<PatientPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Show Details/ })).toBeInTheDocument();
  });

  test('renders Select specialization', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<PatientPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('option', { name: /--Select Specialization--/ })).toBeInTheDocument();
  });


  test('renders Book an appointment', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<PatientPage />} />
        </Routes>
      </MemoryRouter>
    );

    const bookAnAppointmentElement = screen.getByText(/Book an appointment/i);
    expect(bookAnAppointmentElement).toBeInTheDocument();
  });

  test('renders Booked appointments', async () => {
    render(
      <MemoryRouter initialEntries={['/patient/1']}>
        <Routes>
          <Route path="/patient/:userId" element={<PatientPage />} />
        </Routes>
      </MemoryRouter>
    );

    const bookAppointmentsElement = screen.getByText(/Your Booked Appointments/i);
    expect(bookAppointmentsElement).toBeInTheDocument();
  });

});
