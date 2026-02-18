import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { BASE_URL, ENDPOINTS } from "@/lib/constants";

export default function useSchedulesByDateTimeAndSchool(schoolId: number, date: string, time: string) {

  const queryParams = new URLSearchParams({
    schoolId: schoolId.toString(),
    date: date,
    time: time
  }).toString();


  const URL = `${BASE_URL}${ENDPOINTS.SCHEDULES_BY_DATE_TIME_SCHOOL}?${queryParams}`;
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