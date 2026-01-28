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
export function useRunningTime() {
  const URL = BASE_URL + ENDPOINTS.RUNNING_TIME;
  const { data, error, isLoading } = useSWR(
    URL,
    fetcher, 
    { refreshInterval: 10000 }
  );

  return {
    timeData: data,
    timeError: error,
    isLoading
  };
}