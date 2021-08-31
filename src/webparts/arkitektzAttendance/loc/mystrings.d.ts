declare interface IArkitektzAttendanceWebPartStrings {
  PropertyPane: {
    SettingsGroup: {
      GroupName: string;
      ShowDesriptionFieldLabel: string;
      DescriptionFieldLabel: string;
    };
    ConfigurationGroup: {
      GroupName: string;
      ConfigurationType: string;
      ConfigurationTypeOptions: {
        Recommended: string;
        Custom: string;
      };
      UseGeoLocationFieldLabel: string;
      RadiusFieldLabel: string;
      SiteFieldLabel: string;
      ListFieldLabel: string;
      UserColumnFieldLabel: string;
      OfficeLocationCoordinatesColumnFieldLabel: string;
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
        AlignmentFieldLabel: string;
        AlignmentOptions: {
          Left: string;
          Center: string;
          Right: string;
        };
        IconPlacementFieldLabel: string;
        IconPlacementOptions: {
          NoIcon: string;
          OnlyIcon: string;
          IconOnRight: string;
          IconOnLeft: string;
        };
        IconPickerFieldLabel: string;
        IconPickerFieldButtonLabel: string;
      };
    };
    AttendanceSourceGroup: {
      GroupName: string;
      ConfigurationType: string;
      ConfigurationTypeOptions: {
        Recommended: string;
        Custom: string;
      };
      SiteFieldLabel: string;
      ListFieldLabel: string;
      UserColumnFieldLabel: string;
      TimeinColumnFieldLabel: string;
      TimeoutColumnFieldLabel: string;
    };
  };
}

declare module "ArkitektzAttendanceWebPartStrings" {
  const strings: IArkitektzAttendanceWebPartStrings;
  export = strings;
}
