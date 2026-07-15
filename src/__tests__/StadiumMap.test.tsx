import React from 'react';
import { render, screen } from '@testing-library/react';
import StadiumMap from '../components/StadiumMap';

describe('StadiumMap', () => {
  it('renders the stadium map container', () => {
    render(<StadiumMap />);
    const map = screen.getByText('Pitch');
    expect(map).toBeInTheDocument();
  });

  it('renders correctly with an active location', () => {
    render(<StadiumMap activeLocation="Gate A" />);
    // Testing visual active state would normally require checking styles/classes
    // but verifying it doesn't crash is a great start.
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
