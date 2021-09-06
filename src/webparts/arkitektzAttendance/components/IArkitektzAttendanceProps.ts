import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

import { ConfigurationTypeOptions } from "../../../models/Options";
import { IWebpartConfiguration } from "./../../../models/IWebpartConfiguration";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

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
  attendanceListSourceSite: IPropertyFieldSite[];
  attendanceListName: string;
  attendanceListUserColumn: string;
  attendanceListTimeinColumn: string;
  attendanceListTimeoutColumn: string;

  //theme
  themeVariant: IReadonlyTheme | undefined;
}
