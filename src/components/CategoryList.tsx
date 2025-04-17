// src/components/CategoryList.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, updateCategory } from '../api';
import { Category } from '../types';
import CategoryFilter from './CategoryFilter';
import StarToggle from './StarToggle';
import Skeleton from './Skeleton';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Props {
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
}

export default function CategoryList({
  selectedCategories,
  onSelectCategory,
}: Props) {
  const qc = useQueryClient();
  const {
    data: categories = [],
    isLoading,
  } = useQuery<Category[]>(['categories'], getCategories);

  const favMutation = useMutation(updateCategory, {
    onMutate: async (updated) => {
      await qc.cancelQueries(['categories']);
      const previous = qc.getQueryData<Category[]>(['categories']);
      qc.setQueryData<Category[]>(['categories'], (old = []) =>
        old.map((category) => (category.id === updated.id ? updated : category))
      );
      return { previous };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previous) qc.setQueryData(['categories'], context.previous);
    },
    onSettled: () => qc.invalidateQueries(['categories']),
    onSuccess: (upd) => {
      console.log(
        `Category "${upd.name}" favorite toggled: isFavorite=${upd.favorite}`
      );
    },
  });

  const [showFavs, setShowFavs] = useState(false);

  const visible = showFavs
    ? categories.filter((category) => category.favorite)
    : categories;

  return (
    <>
      <CategoryFilter showFavoritesOnly={showFavs} onToggle={setShowFavs} />

      <div className="flex flex-wrap gap-2 md:flex-col md:space-y-2 pt-6">
        {isLoading
          ? [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[40px] w-full rounded" />
          ))
          : visible.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const isFavorite = category.favorite;

            const base =
              'w-auto md:w-fit flex justify-between items-center px-4 py-2 rounded border transition text-regular';
            let variant: string;

            if (isSelected) {
              variant = 'bg-primary text-white border-transparent';
            } else {
              variant = 'border-primary text-primary';
            }

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (isSelected) {
                    onSelectCategory(category.id);
                    toast(`“${category.name}” unselected`);
                  } else {
                    onSelectCategory(category.id);
                    toast(`“${category.name}” selected`);
                  }
                }}
                className={clsx(base, variant)}
              >
                <span className="text-semibold">{category.name}</span>
                <StarToggle
                  filled={isFavorite}
                  selected={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    favMutation.mutate({
                      ...category,
                      favorite: !category.favorite,
                    });
                  }}
                />
              </button>
            );
          })}
      </div>
    </>
  );
}
