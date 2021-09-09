import { StatusOptions } from "./../../../../models/Options";

export interface IButtonProps {
  label: string;
  timein: string;
  uiOptions: any;
  loading: boolean;
  status: StatusOptions;
  onButtonClick: any;
  layout: string;
}
