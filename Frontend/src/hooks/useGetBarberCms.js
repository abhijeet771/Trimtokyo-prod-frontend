import { useQuery } from "@tanstack/react-query";

import { getBarberCms } from "../services/api";

const useGetBarberCms = () => {
  return useQuery({
    queryKey: ["barber-cms"],

    queryFn: async () => {
      const response = await getBarberCms();
      return response.data;
    },
  });
};

export default useGetBarberCms;