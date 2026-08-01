import { useMutation } from "@tanstack/react-query";

import { createBarberCms } from "../services/api";

const useCreateBarberCms = () => {
  return useMutation({
    mutationFn: async () => {
      const response =
        await createBarberCms();

      return response.data;
    },
  });
};

export default useCreateBarberCms;