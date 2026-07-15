import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SecurityDashboard, { Incident } from '../components/SecurityDashboard';

const mockIncidents: Incident[] = [
  {
    id: '1',
    crisisType: 'Lost Child',
    location: 'Gate B',
    identifiers: 'Red shirt',
    translatedMessage: 'Help find my son',
    severity: 'High',
    dispatchUnit: 'Security',
    announcementScriptEn: 'Attention...',
    announcementScriptEs: 'Atencion...',
    timestamp: new Date()
  }
];

describe('SecurityDashboard', () => {
  it('renders empty state correctly', () => {
    render(<SecurityDashboard incidents={[]} onClear={() => {}} />);
    expect(screen.getByText('All clear. No active incidents.')).toBeInTheDocument();
  });

  it('renders incidents correctly', () => {
    render(<SecurityDashboard incidents={mockIncidents} onClear={() => {}} />);
    expect(screen.getByText('"Help find my son"')).toBeInTheDocument();
    expect(screen.getByText('High SEVERITY')).toBeInTheDocument();
  });

  it('triggers resolve handler correctly', () => {
    const handleClear = jest.fn();
    render(<SecurityDashboard incidents={mockIncidents} onClear={handleClear} />);
    
    const resolveButton = screen.getByText('Resolve & Announce');
    fireEvent.click(resolveButton);
    expect(handleClear).toHaveBeenCalledWith('1');
  });
});
