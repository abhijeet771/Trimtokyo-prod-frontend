
import { useQuery } from "@tanstack/react-query";

import { getPublicBarberCms } from "../services/api";

const useGetPublicBarberCms = (slug) => {
  return useQuery({
    queryKey: ["public-barber-cms", slug],

    queryFn: async () => {
      const response = await getPublicBarberCms(slug);
      return response.data;
    },

    // CMS API is not implemented yet.
    enabled: false,
  });
};

export default useGetPublicBarberCms;
