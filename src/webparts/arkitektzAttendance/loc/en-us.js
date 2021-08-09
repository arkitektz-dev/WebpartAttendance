define([], function () {
  return {
    PropertyPane: {
      SettingsGroup: {
        GroupName: "Settings",
        ShowDesription: "Show Description",
        DescriptionFieldLabel: "Desription",
      },
      ConfigurationGroup: {
        GroupName: "Configuration",
        ConfigurationType: "Configuration Type",
        ConfigurationTypeOptions: {
          Recommended: "Recommended",
          Custom: "Custom",
        },
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
          IconPlacementFieldLabel: "Icon Placement",
          IconPlacementOptions: {
            NoIcon: "Text Only",
            OnlyIcon: "Icon Only",
            IconOnRight: "Icon on Right",
            IconOnLeft: "Icon on Left",
          },
        },
      },
      AttendanceListGroup: {
        GroupName: "Attendance List",
        ConfigurationType: "Configuration Type",
        ConfigurationTypeOptions: {
          Recommended: "Recommended",
          Custom: "Custom",
        },
      },
    },
  };
});
