import useSWR from "swr";
import fetcher from "@/lib/fetcher";

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