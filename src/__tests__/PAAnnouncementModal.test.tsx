import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PAAnnouncementModal from '../components/PAAnnouncementModal';

describe('PAAnnouncementModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <PAAnnouncementModal 
        isOpen={false} 
        onClose={() => {}} 
        scriptEn="Test" 
        scriptEs="Prueba" 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <PAAnnouncementModal 
        isOpen={true} 
        onClose={() => {}} 
        scriptEn="Test English" 
        scriptEs="Prueba Spanish" 
      />
    );
    expect(screen.getByText('Auto-Generated PA Announcement')).toBeInTheDocument();
    expect(screen.getByText(/"Test English"/)).toBeInTheDocument();
    expect(screen.getByText(/"Prueba Spanish"/)).toBeInTheDocument();
  });

  it('calls onClose when dismiss is clicked', () => {
    const handleClose = jest.fn();
    render(
      <PAAnnouncementModal 
        isOpen={true} 
        onClose={handleClose} 
        scriptEn="En" 
        scriptEs="Es" 
      />
    );
    
    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
