"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SearchContextValue {
  searchLoading: boolean;
  setSearchLoading: (loading: boolean) => void;
}

const SearchContext = createContext<SearchContextValue>({
  searchLoading: false,
  setSearchLoading: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchLoading, setSearchLoading] = useState(false);
  const setSearchLoadingCallback = useCallback(
    (loading: boolean) => setSearchLoading(loading),
    []
  );
  return (
    <SearchContext.Provider
      value={{ searchLoading, setSearchLoading: setSearchLoadingCallback }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchLoading() {
  return useContext(SearchContext);
}
