export interface IAttendanceListItem {
  id?: number;
  userId?: number;
  timein?: string;
  timeout?: string;
  locationCoordinates?: string;
  locationLabel?: string;
  currentWorkingHours?: string;
}
