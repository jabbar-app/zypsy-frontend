import axios from 'axios';
import { Category, Post } from './types';

export const api = axios.create({
  baseURL: 'http://localhost:9000',
});

// categories
export const getCategories = () =>
  api.get<Category[]>('/categories').then((res) => res.data);
export const updateCategory = (c: Category) =>
  api.put<Category>(`/categories/${c.id}`, c).then((res) => res.data);

// posts
export const getPostsByCategory = (categoryId: string) =>
  api
    .get<Post[]>(`/categories/${categoryId}/posts`)
    .then((res) => res.data);