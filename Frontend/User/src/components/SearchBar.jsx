import React from "react";

const SearchBar = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-white rounded-lg overflow-hidden shadow-md w-full max-w-md"
    >
      <input
        type="text"
        placeholder="Search places..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="flex-grow px-3 py-2 outline-none text-sm sm:text-base"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-3 sm:px-4 py-2 hover:bg-green-700 transition text-sm sm:text-base"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
