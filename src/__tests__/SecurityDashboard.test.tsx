import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SecurityDashboard, { Incident } from '../components/SecurityDashboard';

const mockIncidents: Incident[] = [
  {
    id: '1',
    crisisType: 'Test Incident',
    location: 'Gate 4',
    identifiers: 'Red shirt',
    translatedMessage: 'Help me',
    severity: 'High',
    dispatchUnit: 'Medical Alpha',
    dispatchInstruction: 'Go there quickly',
    announcementScriptEn: 'Please stand back',
    announcementScriptEs: 'Por favor, retroceda',
    timestamp: new Date()
  }
];

describe('SecurityDashboard', () => {
  it('renders incidents correctly', () => {
    const handleClear = jest.fn();
    render(<SecurityDashboard incidents={mockIncidents} onClear={handleClear} />);
    expect(screen.getByText('Test Incident')).toBeInTheDocument();
    expect(screen.getByText('"Help me"')).toBeInTheDocument();
  });

  it('triggers resolve handler correctly', () => {
    const handleClear = jest.fn();
    render(<SecurityDashboard incidents={mockIncidents} onClear={handleClear} />);
    
    // Test the updated button text for "Mic-Drop" pivot
    const resolveBtn = screen.getByRole('button', { name: /Override Digital Signs: Test Incident/i });
    fireEvent.click(resolveBtn);
    
    expect(handleClear).toHaveBeenCalledWith('1');
  });
});
