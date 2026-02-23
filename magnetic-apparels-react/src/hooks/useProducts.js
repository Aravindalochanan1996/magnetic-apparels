import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/api';

export const useProducts = (initialCategory = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productService.getAll({ category, sort, page, limit: 12 });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = searchQuery
    ? products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.appCategory?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return {
    products: filtered,
    loading,
    error,
    category, setCategory,
    sort, setSort,
    page, setPage,
    totalPages,
    searchQuery, setSearchQuery
  };
};
