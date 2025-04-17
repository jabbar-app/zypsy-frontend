import React from 'react';

interface Props {
  showFavoritesOnly: boolean;
  onToggle: (fav: boolean) => void;
}

export default function CategoryFilter({ showFavoritesOnly, onToggle }: Props) {
  return (
    <div className="flex justify-between items-center my-6">
      <label className="inline-flex items-center">
        <input
          type="radio"
          checked={!showFavoritesOnly}
          onChange={() => onToggle(false)}
          className="w-5 h-5 accent-primary"
        />
        <span className="ml-2 text-regular text-primary cursor-pointer">All categories</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          checked={showFavoritesOnly}
          onChange={() => onToggle(true)}
          className="w-5 h-5 accent-primary"
        />
        <span className="ml-2 text-regular text-primary cursor-pointer">Favorite categories</span>
      </label>
    </div>
  );
}