import { useMemo } from "react";

const useSort = (data, sortType) => {
  const sortedData = useMemo(() => {
    if (!sortType) return data;

    const sorted = [...data];

    if (sortType === "a-z") {
      sorted.sort((a, b) =>
        a.shopName.localeCompare(b.shopName)
      );
    }

    if (sortType === "z-a") {
      sorted.sort((a, b) =>
        b.shopName.localeCompare(a.shopName)
      );
    }

    return sorted;
  }, [data, sortType]);

  return sortedData;
};

export default useSort;