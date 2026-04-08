import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { BASE_URL, ENDPOINTS } from "@/lib/constants";

export default function useSchedulesByDateAndSchool(schoolId: number, date: string) {

  const queryParams = new URLSearchParams({
    schoolId: schoolId.toString(),
    date: date,
  }).toString();


  const URL = `${BASE_URL}${ENDPOINTS.SCHEDULE_BY_DATE}?${queryParams}`;
  const { data, error, isLoading } = useSWR(
      URL,
      fetcher,
      { refreshInterval: 10000 }
  );

  return {
    scheduleData: data || [],
    scheduleError: error,
    isLoading
  };
}