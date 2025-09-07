
import React from 'react';
import BookOpenIcon from './icons/BookOpenIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <BookOpenIcon className="h-8 w-8 text-emerald-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          NCI Academic Writing Assistant
        </h1>
        <span className="ml-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          For Irish Universities
        </span>
      </div>
    </header>
  );
};

export default Header;