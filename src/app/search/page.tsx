'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchGames, getPopularGames } from '@/lib/requests';
import GameCard from '@/components/GameCard';
import { Game } from '@/types/game.types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Load games - either popular games or search results
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        
        if (searchTerm) {
          // If search is active, show search results
          const searchResults = await searchGames(searchTerm, page, 12);
          setGames(searchResults);
          setIsSearchActive(true);
        } else {
          // Otherwise show popular games
          const popularGames = await getPopularGames(page
