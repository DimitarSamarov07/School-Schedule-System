import useSWR from "swr";
import fetcher from "@/lib/fetcher";

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
  const { data, error, isLoading } = useSWR(
    'http://37.63.57.37:3000/runningTime', 
    fetcher, 
    { refreshInterval: 10000 }
  );

  return {
    timeData: data,
    timeError: error,
    isLoading
  };
}