import useSWR from "swr";
import fetcher from "@/lib/fetcher"; // This now uses our smart apiRequest
import { ENDPOINTS } from "@/constants/endpoints";

/**
 * Custom hook for fetching and managing the running time data from a specified endpoint.
 */
export function useRunningPeriod(schoolId?: number) {
  // Only pass the endpoint string!
  // Also added a safety check: if schoolId is undefined, don't fetch.
  const endpoint = schoolId ? `${ENDPOINTS.RUNNING_PERIOD}?schoolId=${schoolId}` : null;

  const { data, error, isLoading } = useSWR(
      endpoint, // SWR will pause if endpoint is null
      fetcher,
      { refreshInterval: 10000 }
  );

  return {
    timeData: data,
    timeError: error,
    isLoading
  };
}

export function useNextPeriod(schoolId?: number) {
  const endpoint = schoolId ? `${ENDPOINTS.NEXT_PERIOD}?schoolId=${schoolId}` : null;

  const { data, error, isLoading } = useSWR(
      endpoint,
      fetcher,
      { refreshInterval: 10000 }
  );

  return {
    nextTimeData: data,
    nextTimeError: error,
    isLoading
  };
}