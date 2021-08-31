define([], function () {
  return {
    PropertyPane: {
      SettingsGroup: {
        GroupName: "Settings",
        ShowDesriptionFieldLabel: "Show Description",
        DescriptionFieldLabel: "Desription",
      },
      ConfigurationGroup: {
        GroupName: "Configuration",
        ConfigurationType: "Configuration Type",
        ConfigurationTypeOptions: {
          Recommended: "Recommended",
          Custom: "Custom",
        },
        UseGeoLocationFieldLabel: "Use Location",
        RadiusFieldLabel: "Radius",
        SiteFieldLabel: "Select Site",
        ListFieldLabel: "Select List",
        UserColumnFieldLabel: "User Column",
        OfficeLocationCoordinatesColumnFieldLabel: "Office Location",
      },
      AppearanceGroup: {
        GroupName: "Appearance",
        ButtonConfiguration: {
          TextFieldLabel: "Button Text",
          AppearanceFieldLabel: "Button Appearance",
          AppearanceOptions: {
            NoOutline: "No outline",
            Outline: "Outline",
            FillColor: "Fill Color",
          },
          BorderRadiusFieldLabel: "Border Radius",
          AlignmentFieldLabel: "Button alignment",
          AlignmentOptions: {
            Left: "Left",
            Center: "Center",
            Right: "Right"
          },
          IconPlacementFieldLabel: "Icon Placement",
          IconPlacementOptions: {
            NoIcon: "Text Only",
            OnlyIcon: "Icon Only",
            IconOnRight: "Icon on Right",
            IconOnLeft: "Icon on Left",
          },
          IconPickerFieldLabel: "Select Icon",
          IconPickerFieldButtonLabel: "Icon",
        },
      },
      AttendanceSourceGroup: {
        GroupName: "Attendance Source",
        ConfigurationType: "Configuration Type",
        ConfigurationTypeOptions: {
          Recommended: "Recommended",
          Custom: "Custom",
        },
        SiteFieldLabel: "Select Site",
        ListFieldLabel: "Select List",
        UserColumnFieldLabel: "User Column",
        TimeinColumnFieldLabel: "Timein Column",
        TimeoutColumnFieldLabel: "Timeout Column",
      },
    },
  };
});
