export interface Category {
  id: string;
  name: string;
  favorite: boolean;
}

export interface Post {
  id: string;
  description: string;
  date: string;          // ISO string
  categories: string[];  // array of category IDs
}