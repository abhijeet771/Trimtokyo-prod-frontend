import { useQuery } from "@tanstack/react-query";

import { getMyBarberServices } from "../services/api";

const useGetBarberServicesCms = () => {
  return useQuery({
    queryKey: ["barber-services-cms"],

    queryFn: async () => {
      const response =
        await getMyBarberServices();

      return response.data;
    },
  });
};

export default useGetBarberServicesCms;