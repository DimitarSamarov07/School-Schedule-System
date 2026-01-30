import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import {BASE_URL, ENDPOINTS} from "@/lib/constants";



/**
 * Custom hook for fetching and managing the running time data from a specified endpoint.
 * Uses SWR for data fetching with a refresh interval.
 *
 * @return {Object} An object containing the following properties:
 * - `timeData`: The fetched running time data.
 * - `timeError`: An error object if the data fetching fails.
 * - `isLoading`: A boolean indicating if the data is currently being fetched.
 */
export function useRunningPeriod(schoolId: number): object {
  const URL = BASE_URL + ENDPOINTS.RUNNING_PERIOD +`?schoolId=${schoolId}`;
  const { data, error, isLoading } = useSWR(
    URL,
    fetcher,
    { refreshInterval: 10000 }
  );

  return {
    timeData:  data,
    timeError: error,
    isLoading
  };
}

export function useNextPeriod(schoolId: number) {
  const URL = BASE_URL + ENDPOINTS.NEXT_PERIOD + `?schoolId=${schoolId}`;
  const { data, error, isLoading } = useSWR(
      URL,
      fetcher,
      { refreshInterval: 10000 }
  );

  return {
    nextTimeData: data,
    nextTimeError: error,
    isLoading
  };
}