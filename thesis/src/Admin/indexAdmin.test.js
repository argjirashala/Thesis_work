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
    });

    test('renders List Of Doctors menu item', () => {
      const { getByText } = render(<Router><AdminPage /></Router>);
      expect(getByText('List Of Doctors')).toBeInTheDocument();
    });

    test('renders List Of Patients menu item', () => {
      const { getByText } = render(<Router><AdminPage /></Router>);
      expect(getByText('List Of Patients')).toBeInTheDocument();
    });

    test('renders Register Patient menu item', () => {
      const { getByText } = render(<Router><AdminPage /></Router>);
      expect(getByText('Register Patient')).toBeInTheDocument();
    });

    test('renders Register Doctor menu item', () => {
      const { getByText } = render(<Router><AdminPage /></Router>);
      expect(getByText('Register Doctor')).toBeInTheDocument();
    });

    test('renders List Of Patients menu item', () => {
      const { getByRole } = render(<Router><AdminPage /></Router>);
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    // test('renders Menu button logout', async () => {
    //   render(
    //     <MemoryRouter initialEntries={['/doctor/1']}>
    //       <Routes>
    //         <Route path="/indexAdmin" element={<AdminPage />} />
    //       </Routes>
    //     </MemoryRouter>
         
    //   );
    //   expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    // });
  
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
      

      
      
  
      // test('deletes a doctor', async () => {
      //   // Given
      //   global.confirm = jest.fn(() => true);
      //   const { findAllByText } = render(<Router><AdminPage /></Router>);
      
      //   // Wait for delete button to be present
      //   const deleteButtons = await findAllByText('Delete');
        
      //   // Check if delete buttons are present
      //   if (deleteButtons.length === 0) {
      //     throw new Error('No delete buttons found');
      //   }
      
      //   // When
      //   fireEvent.click(deleteButtons[0]); // Click the first delete button
      
      //   // Then
      //   await waitFor(() => {
      //     expect(firebase.deleteDoc).toHaveBeenCalled();
      //   });
      // });


    afterEach(() => {
        cleanup();
      });
  });
  
  