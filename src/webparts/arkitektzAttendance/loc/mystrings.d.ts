declare interface IArkitektzAttendanceWebPartStrings {
  PropertyPane: {
    SettingsGroup: {
      GroupName: string;
      ShowDesription: string;
      DescriptionFieldLabel: string;
    };
    ConfigurationGroup: {
      GroupName: string;
      ConfigurationType: string;
      ConfigurationTypeOptions: {
        Recommended: string;
        Custom: string;
      };
    };
    AppearanceGroup: {
      GroupName: string;
      ButtonConfiguration: {
        TextFieldLabel: string;
        AppearanceFieldLabel: string;
        AppearanceOptions: {
          NoOutline: string;
          Outline: string;
          FillColor: string;
        };
        BorderRadiusFieldLabel: string;
        IconPlacementFieldLabel: string;
        IconPlacementOptions: {
          NoIcon: string;
          OnlyIcon: string;
          IconOnRight: string;
          IconOnLeft: string;
        };
      };
    };
    AttendanceListGroup: {
      GroupName: string;
      ConfigurationType: string;
      ConfigurationTypeOptions: {
        Recommended: string;
        Custom: string;
      };
    };
  };
}

declare module "ArkitektzAttendanceWebPartStrings" {
  const strings: IArkitektzAttendanceWebPartStrings;
  export = strings;
}
