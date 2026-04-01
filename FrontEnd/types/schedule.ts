interface ScheduleProps {
  data: {
    Class: { Name: string };
    Course: { 
      Name: string; 
      Teacher: { FirstName: string; LastName: string };
      Room: { Name: string };
    };
    Times: { Start: string; End: string };
    Date: { IsHoliday: number };
  };
}
export interface ScheduleItem {
  Class: { Name: string; Room: { Name: string; Floor: number } };
  Subject: {
    Name: string;
  };
  Teacher: { Name: string; };
  Period: { Start: string; End: string };
  Date: { Date: string };
}
export interface ClassInfo {
  hour: number;
  startTime: string | null;
  endTime: string | null;
}
export type ScheduleEntry = {
  Class:   { Id: number; Name: string; };
  Date:    string; // "YYYY-MM-DD"
  Subject: { Id: number; Name: string; };
  Teacher: { Id: number; Name: string; };
  Period:  { Id: number; Name: string; Start: string; End: string; };
  Room:    { Id: number; Name: string; };
};
export default ScheduleProps;