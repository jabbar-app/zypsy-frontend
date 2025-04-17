import axios from 'axios';
import { Category, Post } from './types';

export const api = axios.create({
  baseURL: 'http://localhost:9000',
});

// Categories
export const getCategories = (): Promise<Category[]> =>
  api.get('/categories').then((res) => res.data);

export const updateCategory = async (category: Category): Promise<Category> => {
  try {
    const res = await api.put(`/categories/${category.id}`, category);
    return res.data;
  } catch (error: any) {
    console.error('Failed to update category:', error);
    throw new Error('Failed to update category');
  }
};

// Posts
export const getPostsByCategory = (categoryId: string): Promise<Post[]> =>
  api.get(`/categories/${categoryId}/posts`).then((res) => res.data);
