import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = ({ searchInput, setSearchInput, handleSearch }) => {
  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search places..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-foreground"
        />
      </div>
      <Button type="submit" className="bg-white text-primary hover:bg-white/90">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
