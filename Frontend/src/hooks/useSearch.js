import { useMemo } from "react";

const useSearch = (data, searchTerm) => {
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      item.shopName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return filteredData;
};

export default useSearch;