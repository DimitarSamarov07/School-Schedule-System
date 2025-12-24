import useSWR from "swr";
import fetcher from "@/lib/fetcher";

/**
 * Retrieves schedules for a specific date using the SWR hook.
 *
 * @param {string} date - The date for which to fetch schedules, in the format 'YYYY-MM-DD'.
 * @return {Object} An object containing the fetched schedule data, any error encountered, and the loading state.
 * @return {any} return.scheduleData - The data of the schedules retrieved from the API.
 * @return {Error | undefined} return.scheduleError - Error object if an error occurred during the data fetch, otherwise undefined.
 * @return {boolean} return.isLoading - Indicates whether the data fetch is currently in progress.
 */
export default function useSchedulesByDate(date: string){
    const { data, error, isLoading } = useSWR(
    `http://37.63.57.37:3000/schedulesByDate?date=${date}`, 
    fetcher, 
    { refreshInterval: 10000 }
  );
  return {
    scheduleData: data,
    scheduleError: error,
    isLoading
  }

}