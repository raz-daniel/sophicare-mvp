import { useEffect, useState } from "react";

export const useSearch = <T>(
    items: T[], 
    searchFunction: (item: T, searchTerm: string) => boolean
  ) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<T[]>([]);
  
    useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredItems(items);
      } else {
        const filtered = items.filter(item => searchFunction(item, searchTerm));
        setFilteredItems(filtered);
      }
    }, [searchTerm, items, searchFunction]);
  
    return { searchTerm, setSearchTerm, filteredItems };
  };