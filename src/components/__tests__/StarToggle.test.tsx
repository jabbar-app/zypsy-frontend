import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import StarToggle from '../StarToggle';

afterEach(cleanup);

describe('StarToggle', () => {
  let handleClick: jest.Mock;

  beforeEach(() => {
    handleClick = jest.fn();
  });

  const renderToggle = (filled: boolean, selected = false) =>
    render(<StarToggle filled={filled} selected={selected} onClick={handleClick} />);

  it('renders filled star with white when selected & filled', () => {
    renderToggle(true, true);
    const icon = screen.getByRole('button');
    expect(icon.querySelector('svg')).toHaveClass('text-white');
  });

  it('renders outline star with white when selected only', () => {
    renderToggle(false, true);
    const icon = screen.getByRole('button');
    expect(icon.querySelector('svg')).toHaveClass('text-white');
  });

  it('renders filled star with primary when filled only', () => {
    renderToggle(true, false);
    const icon = screen.getByRole('button');
    expect(icon.querySelector('svg')).toHaveClass('text-primary');
  });

  it('renders outline star with primary when neither filled nor selected', () => {
    renderToggle(false, false);
    const icon = screen.getByRole('button');
    expect(icon.querySelector('svg')).toHaveClass('text-primary');
  });

  it('calls onClick when clicked', () => {
    renderToggle(true, true);
    const icon = screen.getByRole('button');
    fireEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when pressing Enter or Space', () => {
    renderToggle(true, false);
    const icon = screen.getByRole('button');
    fireEvent.keyDown(icon, { key: 'Enter' });
    fireEvent.keyDown(icon, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('has correct aria-label when filled is true', () => {
    renderToggle(true);
    expect(screen.getByLabelText(/unmark as favorite/i)).toBeInTheDocument();
  });

  it('has correct aria-label when filled is false', () => {
    renderToggle(false);
    expect(screen.getByLabelText(/mark as favorite/i)).toBeInTheDocument();
  });
});
