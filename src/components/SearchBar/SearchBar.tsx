import React, { useState, useRef, useEffect } from 'react';
import type { Location } from '../../types/weather';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (location: Location) => void;
  results: Location[];
  isSearching: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSelect,
  results,
  isSearching,
  placeholder = 'Search for a city...',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);
  };

  const handleSelect = (location: Location) => {
    onSelect(location);
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const showResults = isFocused && (results.length > 0 || isSearching);

  return (
    <div className={`search-bar ${isFocused ? 'search-bar--focused' : ''}`}>
      <div className="search-bar__input-wrapper">
        <svg
          className="search-bar__icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="search-bar__input"
        />

        {query && (
          <button
            onClick={handleClear}
            className="search-bar__clear"
            type="button"
            aria-label="Clear search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}

        {isSearching && (
          <div className="search-bar__spinner" />
        )}
      </div>

      {showResults && (
        <div className="search-bar__results">
          {isSearching && results.length === 0 ? (
            <div className="search-bar__loading">
              <span>Searching...</span>
            </div>
          ) : (
            results.map((location, index) => (
              <button
                key={`${location.id}-${index}`}
                onClick={() => handleSelect(location)}
                className="search-bar__result"
              >
                <svg
                  className="search-bar__result-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="search-bar__result-info">
                  <span className="search-bar__result-name">{location.name}</span>
                  <span className="search-bar__result-details">
                    {location.admin1 && `${location.admin1}, `}
                    {location.country}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
