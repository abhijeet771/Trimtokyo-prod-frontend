import { useMemo } from "react";

const useFilter = (data, filter) => {
  const filteredData = useMemo(() => {
    if (!filter || filter === "all") return data;

    return data.filter((item) => {
      const name = item.shopName?.toLowerCase();

      if (filter === "unisex") return name.includes("unisex");
      if (filter === "gents") return name.includes("gents");

      return true;
    });
  }, [data, filter]);

  return filteredData;
};

export default useFilter;