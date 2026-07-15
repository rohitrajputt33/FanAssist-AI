import React from 'react';
import { render, screen } from '@testing-library/react';
import FanInterface from '../components/FanInterface';

describe('FanInterface', () => {
  it('renders the text area and submit button', () => {
    const mockOnReported = jest.fn();
    render(<FanInterface onIncidentReported={mockOnReported} />);
    
    expect(screen.getByPlaceholderText(/I lost my son/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /medical emergency/i })).toBeInTheDocument();
  });
});
