import React from 'react';
import {
  useQueryClient,
  useMutation,
  useQueries,
} from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  getPostsByCategory,
  getCategories,
  updateCategory,
} from '../api';
import { Post, Category } from '../types';
import StarToggle from './StarToggle';
import Skeleton from './Skeleton';
import clsx from 'clsx';

interface Props {
  selectedCategories: string[];
  onSelectCategory: (id: string) => void;
}

export default function PostsList({
  selectedCategories,
  onSelectCategory,
}: Props) {
  const qc = useQueryClient();
  const { data: categories = [] } = useQueries({
    queries: [
      {
        queryKey: ['categories'],
        queryFn: getCategories,
      },
    ],
  })[0];

  const favMutation = useMutation(updateCategory, {
    onMutate: async (updated) => {
      await qc.cancelQueries(['categories']);
      const prev = qc.getQueryData<Category[]>(['categories']);
      qc.setQueryData<Category[]>(['categories'], (old = []) =>
        old.map((c) => (c.id === updated.id ? updated : c))
      );
      return { prev };
    },
    onError: (_e, _v, ctx: any) =>
      ctx?.prev && qc.setQueryData(['categories'], ctx.prev),
    onSettled: () => qc.invalidateQueries(['categories']),
    onSuccess: (upd) => {
      toast.success(
        upd.favorite
          ? `“${upd.name}” added to favorites`
          : `“${upd.name}” removed from favorites`
      );
    },
  });

  const postsQueries = useQueries({
    queries: selectedCategories.map((catId) => ({
      queryKey: ['posts', catId],
      queryFn: () => getPostsByCategory(catId),
      enabled: selectedCategories.length > 0,
    })),
  });

  const isLoading = postsQueries.some((q) => q.isLoading);

  const posts: Post[] = Array.from(
    new Map(
      postsQueries
        .filter((q) => q.data && !q.isError)
        .flatMap((q) => q.data!)
        .map((p) => [p.id, p] as [string, Post])
    ).values()
  );

  if (selectedCategories.length === 0) {
    return (
      <p className="text-foreground-secondary m-6">
        Please pick at least one category.
      </p>
    );
  }

  const selectedNames = categories
    .filter((c) => selectedCategories.includes(c.id))
    .map((c) => c.name)
    .join(', ');

  return (
    <div className='md:border md:border-accent md:rounded md:mt-16'>
      <div className="text-semibold text-foreground-secondary m-6">
        Found {posts.length} posts for “{selectedNames}”
      </div>
      <div className="h-px bg-accent my-4 mx-6" />

      {isLoading ? (
        <div className="space-y-8 mx-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-1/3 mb-3" />
              <Skeleton className="h-5 w-full mb-4" />
              <div className="flex flex-wrap gap-3">
                {[...Array(2)].map((_, j) => (
                  <Skeleton key={j} className="w-24 h-8 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        posts.map((p) => {
          const date = format(parseISO(p.date), 'EEEE, MMMM do yyyy');
          return (
            <article key={p.id} className="mt-8">
              <header className="text-semibold text-primary mx-6 mb-4">
                {date}
              </header>
              <p className="text-regular text-foreground-secondary mx-6 mb-4">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-4 mx-6 mb-8">
                {p.categories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId)!;
                  const isSelected = selectedCategories.includes(cat.id);
                  const isFavorite = cat.favorite;

                  // base + variant classes
                  const base =
                    'w-auto flex justify-between items-center px-4 py-2 rounded border transition text-regular';
                  let variant: string;

                  if (isSelected) {
                    variant = 'bg-primary text-white border-transparent';
                  } else {
                    variant = 'border-primary text-primary';
                  }


                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (isSelected) {
                          onSelectCategory(cat.id); // parent should remove it
                          toast(`“${cat.name}” unselected`);
                        } else {
                          onSelectCategory(cat.id); // parent should add it
                          toast(`“${cat.name}” selected`);
                        }
                      }}
                      className={clsx(base, variant)}
                    >
                      <span className="text-semibold">
                        {cat.name}
                      </span>
                      <StarToggle
                        filled={isFavorite}
                        selected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          favMutation.mutate({
                            ...cat,
                            favorite: !cat.favorite,
                          });
                        }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="h-px bg-accent mx-4 mb-8" />
            </article>
          );
        })
      )}
    </div>
  );
}
