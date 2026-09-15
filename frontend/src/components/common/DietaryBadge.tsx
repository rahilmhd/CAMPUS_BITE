import React from 'react';
import { DietaryType } from '../../types/index.js';

export const DietaryBadge: React.FC<{ type: DietaryType; showText?: boolean }> = ({
  type,
  showText = true,
}) => {
  switch (type) {
    case 'VEGETARIAN':
      return (
        <span className="badge-veg" title="Vegetarian">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {showText && 'Veg'}
        </span>
      );
    case 'NON_VEGETARIAN':
      return (
        <span className="badge-nonveg" title="Non-Vegetarian">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          {showText && 'Non-Veg'}
        </span>
      );
    case 'VEGAN':
      return (
        <span className="badge-vegan" title="Vegan">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          {showText && 'Vegan'}
        </span>
      );
    case 'EGG':
      return (
        <span className="badge-egg" title="Egg">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          {showText && 'Egg'}
        </span>
      );
    default:
      return null;
  }
};
