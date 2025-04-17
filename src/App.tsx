// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import CategoryList from './components/CategoryList';
import PostsList from './components/PostsList';

export default function App() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const raw = localStorage.getItem('selectedCategories');
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      'selectedCategories',
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  const handleSelectCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row h-screen bg-surface">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-surface overflow-auto border-b md:border-b-0 md:border-r border-accent">
          <div className="h-[64px] bg-primary flex items-center justify-center">
            <h2 className="font-semibold text-surface">Posts</h2>
          </div>
          <div className="px-4 pb-4">
            <CategoryList
              selectedCategories={selectedCategories}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto md:ml-6">
          <PostsList
            selectedCategories={selectedCategories}
            onSelectCategory={handleSelectCategory}
          />
        </main>
      </div>
    </>
  );
}
