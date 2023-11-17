import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './Login';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

// Mocking the firebase auth functions
jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };
});

const MockLoginPage = () => {
  return (
    <Router>
      <LoginPage />
    </Router>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    render(<MockLoginPage />);
  });


  // test('renders verification', () => {
  //   expect(screen.getByLabelText(/Are you a doctor?/)).toBeInTheDocument();
  // });

  test('renders email field', () => {
    expect(screen.getByLabelText(/Email:/)).toBeInTheDocument();
  });

  test('renders password field', () => {
    expect(screen.getByLabelText(/Password:/)).toBeInTheDocument();
  });

  test('renders login button', () => {
    expect(screen.getByRole('button', { name: /Login/ })).toBeInTheDocument();
  });

  test('renders forgot-password button', () => {
    expect(screen.getByRole('button', { name: /Forgot Password?/ })).toBeInTheDocument();
  });

  // test('renders register button', () => {
  //   expect(screen.getByRole('button', { name: /Register/ })).toBeInTheDocument();
  // });

  test('allows user to enter email', () => {
    fireEvent.change(screen.getByLabelText(/Email:/), { target: { value: 'test@example.com' } });
    expect(screen.getByLabelText(/Email:/).value).toBe('test@example.com');
  })

  test('allows user to enter password', () => {
    fireEvent.change(screen.getByLabelText(/Password:/), { target: { value: 'password123' } });
    expect(screen.getByLabelText(/Password:/).value).toBe('password123');
  })


  // test('renders login page', () => {
  //   expect(screen.getByLabelText(/Are you a doctor?/)).toBeInTheDocument();
  //   expect(screen.getByLabelText(/Email:/)).toBeInTheDocument();
  //   expect(screen.getByLabelText(/Password:/)).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: /Login/ })).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: /Forgot Password?/ })).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: /Register/ })).toBeInTheDocument();
  // });

  // test('allows user to enter email and password', () => {
  //   fireEvent.change(screen.getByLabelText(/Email:/), { target: { value: 'test@example.com' } });
  //   fireEvent.change(screen.getByLabelText(/Password:/), { target: { value: 'password123' } });
  //   expect(screen.getByLabelText(/Email:/).value).toBe('test@example.com');
  //   expect(screen.getByLabelText(/Password:/).value).toBe('password123');
  // });

  

  test('calls signInWithEmailAndPassword on form submit', async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { email: 'test@example.com', uid: '123' } });
    fireEvent.change(screen.getByLabelText(/Email:/), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password:/), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/ }));
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
  });

  test('calls sendPasswordResetEmail when Forgot Password? button is clicked', async () => {
    sendPasswordResetEmail.mockResolvedValue();
    fireEvent.change(screen.getByLabelText(/Email:/), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Forgot Password?/ }));
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'test@example.com');
  });
});
