import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostsList from '../PostsList';
import * as api from '../../api';
import toast from 'react-hot-toast';

jest.mock('../../api');
jest.mock('react-hot-toast');

describe('PostsList', () => {
  const mockCategories = [
    { id: '1', name: 'Tech', favorite: false },
    { id: '2', name: 'Science', favorite: true },
  ];

  const mockPosts = [
    {
      id: 'post1',
      description: 'Post 1 content',
      date: new Date().toISOString(),
      categories: ['1'],
    },
    {
      id: 'post2',
      description: 'Post 2 content',
      date: new Date().toISOString(),
      categories: ['1', '2'],
    },
  ];

  const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (api.getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);
    (api.updateCategory as jest.Mock).mockImplementation((cat) => Promise.resolve(cat));
  });

  it('renders fallback when no category selected', () => {
    render(<PostsList selectedCategories={[]} onSelectCategory={jest.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText(/please pick at least one category/i)).toBeInTheDocument();
  });

  it('renders posts for selected category', async () => {
    render(<PostsList selectedCategories={['1']} onSelectCategory={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText(/Post 1 content/)).toBeInTheDocument();
      expect(screen.getByText(/Post 2 content/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Found 2 posts for “Tech”/)).toBeInTheDocument();
  });

  it('calls onSelectCategory and shows toast when toggling selection', async () => {
    const onSelect = jest.fn();
    render(<PostsList selectedCategories={['1']} onSelectCategory={onSelect} />, {
      wrapper: createWrapper(),
    });

    const buttons = await screen.findAllByRole('button', { name: /Tech/i });
    fireEvent.click(buttons[0]);

    expect(onSelect).toHaveBeenCalledWith('1');
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('unselected'));
  });

  it('calls updateCategory when star is clicked', async () => {
    render(<PostsList selectedCategories={['1']} onSelectCategory={jest.fn()} />, {
      wrapper: createWrapper(),
    });

    const star = await screen.findAllByRole('button', {
      name: /mark as favorite|unmark as favorite/i,
    });

    fireEvent.click(star[0]);

    await waitFor(() => {
      expect(api.updateCategory).toHaveBeenCalledWith({
        id: '1',
        name: 'Tech',
        favorite: true,
      });
    });
  });
});
