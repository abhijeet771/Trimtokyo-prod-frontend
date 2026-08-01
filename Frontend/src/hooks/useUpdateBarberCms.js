import { useMutation } from "@tanstack/react-query";

const useUpdateBarberCms = (
  apiFunction
) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response =
        await apiFunction(payload);

      return response.data;
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync:
      mutation.mutateAsync,
    isPending:
      mutation.isPending,
    isSuccess:
      mutation.isSuccess,
    isError:
      mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
};

export default useUpdateBarberCms;