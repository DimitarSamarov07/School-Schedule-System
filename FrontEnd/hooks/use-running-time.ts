import useSWR from "swr";
import fetcher from "@/lib/fetcher"; // This now uses our smart apiRequest
import { ENDPOINTS } from "@/constants/endpoints";

// 1. Define and export the shape of your data
export interface PeriodData {
  label: string;
  startTime: string;
  endTime: string;
}

/**
 * Custom hook for fetching and managing the running time data from a specified endpoint.
 */
export function useRunningPeriod(schoolId?: number) {
  // Only pass the endpoint string!
  // Also added a safety check: if schoolId is undefined, don't fetch.
  const endpoint = schoolId ? `${ENDPOINTS.PERIOD.CURRENT}?schoolId=${schoolId}` : null;

  // 2. Pass <PeriodData, Error> to useSWR.
  // 'data' is now strongly typed as 'PeriodData | undefined'
  const { data, error, isLoading } = useSWR<PeriodData, Error>(
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
  const endpoint = schoolId ? `${ENDPOINTS.PERIOD.NEXT}?schoolId=${schoolId}` : null;

  // 2. Pass <PeriodData, Error> here as well
  const { data, error, isLoading } = useSWR<PeriodData, Error>(
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