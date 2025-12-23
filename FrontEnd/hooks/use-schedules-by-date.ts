import useSWR from "swr";
import fetcher from "@/lib/fetcher";

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