// src/components/StarToggle.tsx
import React, { MouseEvent, KeyboardEvent } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import clsx from 'clsx';

interface StarToggleProps {
  filled: boolean; // isFav
  selected?: boolean; // isSel
  onClick: (
    e: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>
  ) => void;
}

export default function StarToggle({
  filled,
  selected = false,
  onClick,
}: StarToggleProps) {
  // Determine which icon (fill vs outline) and color
  let IconComponent;
  let colorClass: string;

  if (selected && filled) {
    // selected & favorite → filled white star
    IconComponent = AiFillStar;
    colorClass = 'text-white';
  } else if (selected && !filled) {
    // selected only → outline white star
    IconComponent = AiOutlineStar;
    colorClass = 'text-white';
  } else if (!selected && filled) {
    // favorite only → filled dark star
    IconComponent = AiFillStar;
    colorClass = 'text-primary';
  } else {
    // neither → outline dark star
    IconComponent = AiOutlineStar;
    colorClass = 'text-primary';
  }

  // keyboard support
  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={filled ? 'Unmark as favorite' : 'Mark as favorite'}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="ml-2 p-1 focus:outline-none inline-flex items-center"
    >
      <IconComponent className={clsx(colorClass, 'text-xl')} />
    </span>
  );
}
