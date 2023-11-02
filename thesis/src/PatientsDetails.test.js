// Mock the Firebase Firestore module
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

  import React from 'react';
  import { render, screen, waitFor, fireEvent } from '@testing-library/react';
  import '@testing-library/jest-dom';
  import PatientDetailsTable from './PatientsDetails';
  import { BrowserRouter as Router } from 'react-router-dom';
  import * as firebase from 'firebase/firestore';
  import { cleanup } from '@testing-library/react';
  
  describe('PatientDetailsTable', () => {
    const mockAppointments = [
      { id: '1', patientId: '1', patientName: 'John', patientSurname: 'Doe', date: '2023-01-01', diagnosis: 'Cold', therapy: 'Rest', fileURL: 'http://example.com/file' },
      // ... add more mock appointments if needed
    ];
  
    const mockPatients = [
      { id: '1', name: 'John', surname: 'Doe' },
      // ... add more mock patients if needed
    ];
  
    beforeEach(() => {
      // Setup mocks for Firestore
      firebase.getFirestore.mockReturnValue({});
      firebase.collection.mockReturnValue({});
      firebase.doc.mockReturnValue({});
      firebase.query.mockReturnValue({});
      firebase.where.mockReturnValue({});
      firebase.getDocs.mockResolvedValue({ docs: mockAppointments.map(appointment => ({ id: appointment.id, data: () => appointment })) });
      firebase.getDoc.mockImplementation((db, collection, id) => {
        const patient = mockPatients.find(p => p.id === id);
        return Promise.resolve({ exists: () => !!patient, data: () => patient });
      });
      firebase.setDoc.mockResolvedValue({});
  
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    test('renders without crashing', () => {
      const { getByText } = render(<Router><PatientDetailsTable /></Router>);
      expect(getByText('List of Patients')).toBeInTheDocument();
    });
  
    test('displays patient data', async () => {
      render(
        <Router>
          <PatientDetailsTable />
        </Router>
      );
  
      // Wait for the patient data to be displayed
      await waitFor(() => {
        for (const appointment of mockAppointments) {
          const patientNameElements = screen.getAllByText(appointment.patientName);
          expect(patientNameElements.length).toBeGreaterThan(0);
          
          const patientSurnameElements = screen.getAllByText(appointment.patientSurname);
          expect(patientSurnameElements.length).toBeGreaterThan(0);
        }
      });
    });
  

  
    afterEach(() => {
      cleanup();
    });
  });
  
