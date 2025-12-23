import { ClassInfo } from "@/types/schedule";

export function getFormattedScheduleStrings({ hour, startTime, endTime }: ClassInfo) {
  // 1. Format the Hour with Bulgarian Suffixes
  let classNumber = "";
  if (hour >= 1 && hour <= 8) {
    const suffixes: Record<number, string> = {
      1: "ви",
      2: "ри",
      7: "ми",
      8: "ми",
    };
    const suffix = suffixes[hour] || "ти";
    classNumber = `${hour}-${suffix} час`;
  }

  const timeRange = (startTime && endTime) ? `${startTime} - ${endTime}` : "";

  return {
    classNumber, // e.g., "1-ви час"
    timeRange    // e.g., "08:00 - 08:45"
  };
}