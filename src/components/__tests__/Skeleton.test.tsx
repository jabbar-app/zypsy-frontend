import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from '../Skeleton';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    const div = container.firstChild as HTMLElement;

    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('animate-pulse');
    expect(div).toHaveClass('bg-accent');
    expect(div).toHaveClass('rounded');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<Skeleton className="h-8 w-32" />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveClass('h-8');
    expect(div).toHaveClass('w-32');
  });

  it('merges default and custom classes correctly', () => {
    const { container } = render(<Skeleton className="my-4" />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveClass('animate-pulse', 'bg-accent', 'rounded', 'my-4');
  });
});
