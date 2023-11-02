import React from 'react';
import { cleanup, render, screen,userEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DoctorPage from './indexDoctor';
import * as firebase from 'firebase/firestore';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../__mocks__/firebase/firestore');


describe('Doctor Page', () => {
  beforeEach(() => {
    jest.mock('../__mocks__/firebase/firestore');
  });

  afterEach(() => {
    jest.unmock('../__mocks__/firebase/firestore');
  });

  test('renders Welcome message', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    const welcomeElement = screen.getByText(/Welcome/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  test('renders Logout button', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Logout/ })).toBeInTheDocument();
  });

  test('renders Register Patient button', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Register Patient/ })).toBeInTheDocument();
  });

  test('renders ShowDetails button', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /Show Details/ })).toBeInTheDocument();
  });

  test('renders Set availability', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Set Your Availability/)).toBeInTheDocument();
  });


  test('renders Todays Appointments', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    const todaysAppointmentElement = screen.getByText(/Today's Appointments/i);
    expect(todaysAppointmentElement).toBeInTheDocument();
  });

  test('renders Upcoming Appointments', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    const upcomingAppointmentsElement = screen.getByText(/Upcoming Appointments/i);
    expect(upcomingAppointmentsElement).toBeInTheDocument();
  });


  test('renders List of Patients', async () => {
    render(
      <MemoryRouter initialEntries={['/doctor/1']}>
        <Routes>
          <Route path="/doctor/:userId" element={<DoctorPage />} />
        </Routes>
      </MemoryRouter>
    );

    const listOfPatientsElement = screen.getByText(/List Of Patients/i);
    expect(listOfPatientsElement).toBeInTheDocument();
  });

});

