import { useQuery } from "@tanstack/react-query";
import { fetchPostalCodeData } from "@/api/location";

export const useLocationByPincode = (pincode) => {
  return useQuery({
    queryKey: ["pincode", pincode],
    queryFn: () => fetchPostalCodeData(pincode),
    // Only run the query if the pincode is exactly 6 digits
    enabled: !!pincode && /^\d{6}$/.test(pincode),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours, postal codes rarely change
    retry: 1,
  });
};
