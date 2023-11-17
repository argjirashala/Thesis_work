import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const mockAppointment = {
    diagnosis: 'Flu',
    therapy: 'Rest and drink plenty of fluids',
    fileURL: 'https://example.com/medical-file.pdf',
  };

  test('should not render diagnosis when isOpen is false', () => {
    const { queryByText } = render(
      <Modal isOpen={false} onClose={mockOnClose} appointment={mockAppointment} />
    );
    expect(queryByText(/Diagnosis:/i)).not.toBeInTheDocument();
  });

  test('should not render therapy when isOpen is false', () => {
    const { queryByText } = render(
      <Modal isOpen={false} onClose={mockOnClose} appointment={mockAppointment} />
    );
    expect(queryByText(/Therapy:/i)).not.toBeInTheDocument();
  });

  test('should render diagnosis when isOpen is true', () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={mockOnClose} appointment={mockAppointment} />
    );
    expect(getByText(/Diagnosis: Flu/i)).toBeInTheDocument();
  });

  test('should render therapy when isOpen is true', () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={mockOnClose} appointment={mockAppointment} />
    );

    expect(getByText(/Therapy: Rest and drink plenty of fluids/i)).toBeInTheDocument();
  });

  test('should call onClose when the close button is clicked', () => {
    const { getByText } = render(
      <Modal isOpen={true} onClose={mockOnClose} appointment={mockAppointment} />
    );
    fireEvent.click(getByText('X'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should render an iframe if fileURL is provided', () => {
    const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} appointment={mockAppointment} />
      );
      expect(container.querySelector('.iframe')).toBeInTheDocument();
      
  });
});
