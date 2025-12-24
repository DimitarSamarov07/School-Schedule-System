import { ClassInfo } from "@/types/schedule";

/**
 * Generates formatted schedule strings based on the provided class information.
 *
 * @param {Object} classInfo - The class information.
 * @param {number} classInfo.hour - The hour of the class (e.g., 1-8).
 * @param {string} [classInfo.startTime] - The optional start time of the class.
 * @param {string} [classInfo.endTime] - The optional end time of the class.
 * @return {Object} An object containing the formatted class number and time range.
 * @return {string} return.classNumber - The formatted class number string (e.g., "1-ви час").
 * @return {string} return.timeRange - The formatted time range string (e.g., "10:00 - 11:00").
 */
export function getFormattedScheduleStrings({ hour, startTime, endTime }: ClassInfo): object {
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
    classNumber,
    timeRange
  };
}