import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('shows the welcome heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });
});