jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
    setDoc: jest.fn(),
  }));

  import React from 'react';
  import { render, waitFor, screen ,fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
  import AdminPage from './indexAdmin';
  import { BrowserRouter as Router } from 'react-router-dom';
  import * as firebase from 'firebase/firestore';
  import { cleanup } from '@testing-library/react';
  
  describe('AdminPage', () => {
    const mockDoctors = [
      { id: '1', name: 'Doctor1', surname: 'Surname1', email: 'doctor1@email.com' },
      // ... add more mock doctors if needed
    ];
  
    const mockPatients = [
      { id: '1', name: 'Patient1', surname: 'Surname1', email: 'patient1@email.com' },
      // ... add more mock patients if needed
    ];
  
    beforeEach(() => {
      // Setup mocks for Firestore
      firebase.getFirestore.mockReturnValue({});
      firebase.collection.mockReturnValue({});
      firebase.getDocs.mockResolvedValue({ docs: mockDoctors.map(doc => ({ id: doc.id, data: () => doc })) });
      firebase.doc.mockReturnValue({});
      firebase.deleteDoc.mockResolvedValue({});
      firebase.setDoc.mockResolvedValue({});
  
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    test('renders without crashing', () => {
      const { getByText } = render(<Router><AdminPage /></Router>);
      expect(getByText('Doctors')).toBeInTheDocument();
      expect(getByText('Patients')).toBeInTheDocument();
    });
  
    test('displays doctors data', async () => {
        firebase.getDocs.mockResolvedValueOnce({
          docs: mockDoctors.map(doc => ({
            id: doc.id,
            data: () => doc
          }))
        });
      
        render(
          <Router>
            <AdminPage />
          </Router>
        );
      
        // Wait for the doctors data to be displayed
        for (const doctor of mockDoctors) {
          await waitFor(() => {
            expect(screen.getAllByText(doctor.name)[0]).toBeInTheDocument();
            expect(screen.getAllByText(doctor.surname)[0]).toBeInTheDocument();
            expect(screen.getAllByText(doctor.email)[0]).toBeInTheDocument();
          });
        }
      });
      
      test('displays patients data', async () => {
        // Mock return value for fetching doctors' data
        firebase.getDocs
          .mockResolvedValueOnce({
            docs: mockDoctors.map(doc => ({
              id: doc.id,
              data: () => doc
            }))
          })
          // Mock return value for fetching patients' data
          .mockResolvedValueOnce({
            docs: mockPatients.map(patient => ({
              id: patient.id,
              data: () => patient
            }))
          });
      
        render(
          <Router>
            <AdminPage />
          </Router>
        );
      
        // Wait for the patients' data to be displayed
        for (const patient of mockPatients) {
          await waitFor(() => {
            expect(screen.getAllByText(patient.name)[0]).toBeInTheDocument();
            expect(screen.getAllByText(patient.surname)[0]).toBeInTheDocument();
            expect(screen.getAllByText(patient.email)[0]).toBeInTheDocument();
          });
        }
      });
      
      
  
      test('deletes a doctor', async () => {
        // Given
        global.confirm = jest.fn(() => true);
        const { findAllByText } = render(<Router><AdminPage /></Router>);
      
        // Wait for delete button to be present
        const deleteButtons = await findAllByText('Delete');
        
        // Check if delete buttons are present
        if (deleteButtons.length === 0) {
          throw new Error('No delete buttons found');
        }
      
        // When
        fireEvent.click(deleteButtons[0]); // Click the first delete button
      
        // Then
        await waitFor(() => {
          expect(firebase.deleteDoc).toHaveBeenCalled();
        });
      });

      test('deletes a patient', async () => {
        // Given
        global.confirm = jest.fn(() => true);
        const { findAllByText } = render(<Router><AdminPage /></Router>);
      
        // Wait for delete button to be present
        const deleteButtons = await findAllByText('Delete');
        
        // Check if delete buttons are present
        if (deleteButtons.length === 0) {
          throw new Error('No delete buttons found');
        }
      
        // When
        fireEvent.click(deleteButtons[0]); // Click the first delete button
      
        // Then
        await waitFor(() => {
          expect(firebase.deleteDoc).toHaveBeenCalled();
        });
      });

    afterEach(() => {
        cleanup();
      });
  });
  
  