import { useCallback, useEffect, useState } from "react";

import {
  searchBarbers,
  getSearchFilters,
} from "../services/api";

const useShopSearch = () => {
  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */

  const [barbers, setBarbers] =
    useState([]);

  const [filters, setFilters] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

  const [query, setQuery] =
    useState({
      page: 1,
      limit: 10,

      search: "",

      city: "",

      businessType: "",

      featured: false,

      delivery: false,

      rating: "",

      sort: "featured",
    });

  /* -------------------------------------------------------------------------- */
  /*                             FETCH BARBERS                                  */
  /* -------------------------------------------------------------------------- */

  const fetchBarbers =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await searchBarbers(query);

        setBarbers(
          response.data.data || []
        );

        if (
          response.data.pagination
        ) {
          setPagination(
            response.data.pagination
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, [query]);

  /* -------------------------------------------------------------------------- */
  /*                             FETCH FILTERS                                  */
  /* -------------------------------------------------------------------------- */

  const fetchFilters =
    useCallback(async () => {
      try {
        const response =
          await getSearchFilters();

        setFilters(
          response.data.data
        );
      } catch (error) {
        console.error(error);
      }
    }, []);

  /* -------------------------------------------------------------------------- */
  /*                               FILTER UPDATE                                */
  /* -------------------------------------------------------------------------- */

  const updateQuery = (
    key,
    value
  ) => {
    setQuery((prev) => ({
      ...prev,

      page: 1,

      [key]: value,
    }));
  };

  /* -------------------------------------------------------------------------- */
  /*                              PAGE CHANGE                                   */
  /* -------------------------------------------------------------------------- */

  const changePage = (
    page
  ) => {
    setQuery((prev) => ({
      ...prev,

      page,
    }));
  };

  /* -------------------------------------------------------------------------- */
  /*                              CLEAR FILTERS                                 */
  /* -------------------------------------------------------------------------- */

  const clearFilters = () => {
    setQuery({
      page: 1,
      limit: 10,

      search: "",

      city: "",

      businessType: "",

      featured: false,

      delivery: false,

      rating: "",

      sort: "featured",
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                                  EFFECTS                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  /* -------------------------------------------------------------------------- */
  /*                                  RETURN                                    */
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