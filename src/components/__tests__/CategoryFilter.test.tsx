// src/components/__tests__/CategoryFilter.test.tsx
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import CategoryFilter from '../CategoryFilter';

describe('CategoryFilter', () => {
  // helper that unmounts any prior renders, then renders fresh
  const setup = (showFavoritesOnly = false) => {
    cleanup(); // unmount previous, so render() starts clean
    const onToggle = jest.fn();
    render(
      <CategoryFilter
        showFavoritesOnly={showFavoritesOnly}
        onToggle={onToggle}
      />
    );
    const allRadio = screen.getByRole('radio', { name: /all categories/i });
    const favRadio = screen.getByRole('radio', { name: /favorite categories/i });
    return { allRadio, favRadio, onToggle };
  };

  afterAll(() => cleanup());

  it('renders two radio buttons with correct labels', () => {
    const { allRadio, favRadio } = setup();
    expect(allRadio).toBeInTheDocument();
    expect(favRadio).toBeInTheDocument();
    expect(screen.getByText(/all categories/i)).toBeInTheDocument();
    expect(screen.getByText(/favorite categories/i)).toBeInTheDocument();
  });

  it('reflects checked state when showFavoritesOnly = false', () => {
    const { allRadio, favRadio } = setup(false);
    expect(allRadio).toBeChecked();
    expect(favRadio).not.toBeChecked();
  });

  it('reflects checked state when showFavoritesOnly = true', () => {
    const { allRadio, favRadio } = setup(true);
    expect(allRadio).not.toBeChecked();
    expect(favRadio).toBeChecked();
  });

  it('calls onToggle(false) when clicking "All categories"', () => {
    const { allRadio, onToggle } = setup(true);
    fireEvent.click(allRadio);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('calls onToggle(true) when clicking "Favorite categories"', () => {
    const { favRadio, onToggle } = setup(false);
    fireEvent.click(favRadio);
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
