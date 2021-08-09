import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IArkitektzAttendanceProps {
  context: WebPartContext;

  //settings
  showDescription: boolean;
  description: string;

  //appearance
  buttonText: string;
  buttonAppearance: string;
  buttonBorderRadius: number;
  iconPlacement: string;
}
