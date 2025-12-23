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
  Class: { Name: string; Description: string };
  Course: { 
    Name: string; 
    Teacher: { FirstName: string; LastName: string };
    Room: { Name: string; Floor: number };
  };
  Times: { Start: string; End: string };
  Date: { Date: string };
}
export interface ClassInfo {
  hour: number;
  startTime: string | null;
  endTime: string | null;
}
export default ScheduleProps;