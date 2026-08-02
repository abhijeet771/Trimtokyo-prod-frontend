import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";

import { getBarberCms } from "../services/api";

const useGetBarberCms = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "barber-cms",
      user?.tenantId,
    ],

    enabled: !!user?.tenantId,

    queryFn: async () => {
      const response =
        await getBarberCms();

      return response.data;
    },
  });
};

export default useGetBarberCms;