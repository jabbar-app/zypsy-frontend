import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategoryList from '../CategoryList';
import * as api from '../../api';
import toast from 'react-hot-toast';

jest.mock('../../api');
jest.mock('react-hot-toast');

describe('CategoryList', () => {
  const mockCategories = [
    { id: '1', name: 'Design', favorite: false },
    { id: '2', name: 'Engineering', favorite: true },
  ];

  const setup = (selectedCategories: string[] = []) => {
    const queryClient = new QueryClient();
    const onSelectCategory = jest.fn();

    (api.getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (api.updateCategory as jest.Mock).mockImplementation((cat) => Promise.resolve(cat));

    render(
      <QueryClientProvider client={queryClient}>
        <CategoryList
          selectedCategories={selectedCategories}
          onSelectCategory={onSelectCategory}
        />
      </QueryClientProvider>
    );

    return { onSelectCategory };
  };

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders all categories by default', async () => {
    setup();

    await screen.findByText('Design');
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('filters only favorite categories when toggled', async () => {
    setup();

    const favRadio = await screen.findByRole('radio', { name: /favorite categories/i });
    fireEvent.click(favRadio);

    expect(await screen.findByText('Engineering')).toBeInTheDocument();
    expect(screen.queryByText('Design')).toBeNull();
  });

  it('calls onSelectCategory and shows toast when category clicked', async () => {
    const { onSelectCategory } = setup();

    const designBtn = await screen.findByRole('button', { name: /Design/i });
    fireEvent.click(designBtn);

    expect(onSelectCategory).toHaveBeenCalledWith('1');
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('selected'));
  });

  it('toggles favorite when star is clicked', async () => {
    setup();

    const starBtn = await screen.findByLabelText(/unmark as favorite/i);
    fireEvent.click(starBtn);

    await waitFor(() =>
      expect(api.updateCategory).toHaveBeenCalledWith({
        id: '2',
        name: 'Engineering',
        favorite: false,
      })
    );
  });
});
