import {
  getCategories,
  getPostsByCategory,
  updateCategory,
} from '../api';
import type { Category, Post } from '../types';

jest.mock('../api');

describe('api.ts', () => {
  const mockCategories: Category[] = [
    { id: '1', name: 'Tech', favorite: false },
    { id: '2', name: 'Science', favorite: true },
  ];

  const mockPosts: Post[] = [
    {
      id: 'post1',
      description: 'Post 1',
      date: new Date().toISOString(),
      categories: ['1'],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (getCategories as jest.Mock).mockResolvedValue(mockCategories);
    (getPostsByCategory as jest.Mock).mockResolvedValue(mockPosts);
    (updateCategory as jest.Mock).mockImplementation((cat) =>
      Promise.resolve({ ...cat, favorite: !cat.favorite })
    );
  });

  it('returns categories from API', async () => {
    const result = await getCategories();
    expect(result).toEqual(mockCategories);
  });

  it('returns posts for a category from API', async () => {
    const result = await getPostsByCategory('1');
    expect(result).toEqual(mockPosts);
  });

  it('updates category and returns updated data', async () => {
    const updated = { ...mockCategories[0], favorite: true };
    const result = await updateCategory(updated);
    expect(result).toEqual({ ...updated, favorite: false }); // karena di mock: !cat.favorite
  });

  it('throws error if update fails', async () => {
    (updateCategory as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    await expect(updateCategory(mockCategories[0])).rejects.toThrow('API error');
  });
});
