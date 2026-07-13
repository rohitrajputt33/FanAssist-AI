import React from 'react';
import { render, screen } from '@testing-library/react';
import FanInterface from '../components/FanInterface';

describe('FanInterface', () => {
  it('renders the text area and submit button', () => {
    const mockOnReported = jest.fn();
    render(<FanInterface onIncidentReported={mockOnReported} />);
    
    expect(screen.getByLabelText(/what is happening\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send emergency alert/i })).toBeInTheDocument();
  });
});
