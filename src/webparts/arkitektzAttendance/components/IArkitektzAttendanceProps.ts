import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import { ConfigurationTypeOptions } from "../../../models/Options";
import { IWebpartConfiguration } from "./../../../models/IWebpartConfiguration";

export interface IArkitektzAttendanceProps {
  context: WebPartContext;
  webpartConfiguration: IWebpartConfiguration;

  //settings
  showDescription: boolean;
  description: string;

  // configuration
  useGeoLocation: boolean;
  radius: number;

  //appearance
  buttonText: string;
  buttonAppearance: string;
  buttonBorderRadius: number;
  buttonAlignment: string;
  iconPlacement: string;
  selectedIcon: string;

  // attendance source
  attendanceListSourceConfigurationType: ConfigurationTypeOptions;

  //theme
  themeVariant: IReadonlyTheme | undefined;
}
