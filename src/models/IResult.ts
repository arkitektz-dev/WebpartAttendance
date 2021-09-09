import { IAttendanceListItem } from "./IAttendanceListItem";

export interface IResult {
  entity: any;
  errorDetails: {
    errorObj: Error;
    clientMessage: string;
  };
}
