import { useInfiniteQuery } from "@tanstack/react-query";
import { AllWorkersProfile } from "@/api/Home";

export const useWorkers = ({ activeService, pincode, sort, id }) => {
  return useInfiniteQuery({
    queryKey: ["workers", activeService, pincode, sort, id],

    queryFn: ({ pageParam = 1 }) =>
      AllWorkersProfile({
        params: {
          occupation: activeService,
          pincode: pincode?.length === 6 ? pincode : undefined,
          sort,
          id,
          page: pageParam,
        },
      }),

    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.pagination || {};
      return page && totalPages && page < totalPages ? page + 1 : undefined;
    },

    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
  });
};