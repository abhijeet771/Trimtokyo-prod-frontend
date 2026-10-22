import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "react-router-dom";

import { searchBarbers, getSearchFilters,} from "../../services/search.service.js";

const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  search: "",
  city: "",
  businessType: "",
  featured: false,
  delivery: false,
  rating: "",
  sort: "featured",
};

const useShopSearch = () => {
  /* -------------------------------------------------------------------------- */
  /*                              URL SEARCH PARAMS                             */
  /* -------------------------------------------------------------------------- */

  const [searchParams] = useSearchParams();

  const urlSearch = (
    searchParams.get("q") ||
    searchParams.get("search") ||
    ""
  ).trim();

  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */

  const [barbers, setBarbers] = useState([]);

  const [filters, setFilters] = useState(null);

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [query, setQuery] = useState(() => ({
    ...DEFAULT_QUERY,
    search: urlSearch,
  }));

  /* -------------------------------------------------------------------------- */
  /*                         SYNC SEARCH WITH THE URL                           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setQuery((prev) => {
      if (prev.search === urlSearch) {
        return prev;
      }

      return {
        ...prev,
        page: 1,
        search: urlSearch,
      };
    });
  }, [urlSearch]);

  /* -------------------------------------------------------------------------- */
  /*                              FETCH BARBERS                                 */
  /* -------------------------------------------------------------------------- */

  const fetchBarbers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await searchBarbers(query);

      const data = response?.data?.data;
      const paginationData = response?.data?.pagination;

      setBarbers(Array.isArray(data) ? data : []);

      if (paginationData) {
        setPagination(paginationData);
      } else {
        setPagination((prev) => ({
          ...prev,
          total: Array.isArray(data) ? data.length : 0,
        }));
      }
    } catch (error) {
      console.error(
        "Failed to fetch shop search results:",
        error
      );

      setBarbers([]);

      setPagination((prev) => ({
        ...prev,
        total: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }));
    } finally {
      setLoading(false);
    }
  }, [query]);

  /* -------------------------------------------------------------------------- */
  /*                              FETCH FILTERS                                 */
  /* -------------------------------------------------------------------------- */

  const fetchFilters = useCallback(async () => {
    try {
      const response = await getSearchFilters();

      setFilters(response?.data?.data ?? null);
    } catch (error) {
      console.error(
        "Failed to fetch search filters:",
        error
      );
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               FILTER UPDATE                                */
  /* -------------------------------------------------------------------------- */

  const updateQuery = useCallback((key, value) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                PAGE CHANGE                                 */
  /* -------------------------------------------------------------------------- */

  const changePage = useCallback((page) => {
    const nextPage = Number(page);

    if (!Number.isInteger(nextPage) || nextPage < 1) {
      return;
    }

    setQuery((prev) => ({
      ...prev,
      page: nextPage,
    }));
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               CLEAR FILTERS                                */
  /* -------------------------------------------------------------------------- */

  const clearFilters = useCallback(() => {
    setQuery({
      ...DEFAULT_QUERY,
      search: urlSearch,
    });
  }, [urlSearch]);

  /* -------------------------------------------------------------------------- */
  /*                                   EFFECTS                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  /* -------------------------------------------------------------------------- */
  /*                                   RETURN                                   */
  /* -------------------------------------------------------------------------- */

  return {
    loading,
    barbers,
    filters,
    pagination,
    query,
    updateQuery,
    changePage,
    clearFilters,
    refresh: fetchBarbers,
  };
};

export default useShopSearch;
