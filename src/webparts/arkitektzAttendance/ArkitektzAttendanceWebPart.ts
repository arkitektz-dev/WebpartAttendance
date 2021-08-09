import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup,
  IPropertyPaneConfiguration,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as webPartStrings from "ArkitektzAttendanceWebPartStrings";
import ArkitektzAttendance from "./components/ArkitektzAttendance";
import { IArkitektzAttendanceProps } from "./components/IArkitektzAttendanceProps";
import {
  IconPlacementOptions,
  ButtonAppearanceOptions,
  ConfigurationTypeOptions,
} from "../../models/Options";

export interface IArkitektzAttendanceWebPartProps {
  //settings
  showDescription: boolean;
  description: string;
  //configuration
  configurationType: string;
  //appearance
  buttonText: string;
  buttonAppearance: string;
  buttonBorderRadius: number;
  iconPlacement: string;
  //attendance
  attendanceListConfiguration: string;
}

export default class ArkitektzAttendanceWebPart extends BaseClientSideWebPart<IArkitektzAttendanceWebPartProps> {
  protected onInit(): Promise<void> {
    this.initializeProperties();

    return super.onInit();
  }

  public render(): void {
    console.log(this.properties);

    const element: React.ReactElement<IArkitektzAttendanceProps> =
      React.createElement(ArkitektzAttendance, {
        //context
        context: this.context,
        //settings
        showDescription: this.properties.showDescription,
        description: this.properties.description,
        //configuration

        //appearance
        buttonText: this.properties.buttonText,
        buttonAppearance: this.properties.buttonAppearance,
        buttonBorderRadius: this.properties.buttonBorderRadius,
        iconPlacement: this.properties.iconPlacement,
        //attendance
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: webPartStrings.PropertyPane.SettingsGroup.GroupName,
              groupFields: this._getSettingsFields(),
              isCollapsed: true,
            },
            {
              groupName: webPartStrings.PropertyPane.AppearanceGroup.GroupName,
              groupFields: this._getAppearanceFields(),
              isCollapsed: true,
            },
            {
              groupName:
                webPartStrings.PropertyPane.AttendanceListGroup.GroupName,
              groupFields: this._getAttendanceListFields(),
              isCollapsed: false,
            },
            {
              groupName:
                webPartStrings.PropertyPane.ConfigurationGroup.GroupName,
              groupFields: this._getConfigurationFields(),
              isCollapsed: false,
            },
          ],
        },
      ],
    };
  }

  private initializeProperties() {
    this.properties.buttonAppearance =
      this.properties.buttonAppearance || ButtonAppearanceOptions.NoOutline;

    this.properties.iconPlacement =
      this.properties.iconPlacement || IconPlacementOptions.NoIcon;

    this.properties.configurationType =
      this.properties.configurationType || ConfigurationTypeOptions.Recommended;

    this.properties.attendanceListConfiguration =
      this.properties.attendanceListConfiguration || ConfigurationTypeOptions.Recommended;
  }

  private _getSettingsFields(): IPropertyPaneField<any>[] {
    const settingsFields: IPropertyPaneField<any>[] = [
      PropertyPaneToggle("showDescription", {
        label: webPartStrings.PropertyPane.SettingsGroup.ShowDesription,
        checked: this.properties.showDescription,
      }),
    ];

    if (this.properties.showDescription) {
      settingsFields.push(
        PropertyPaneTextField("description", {
          label:
            webPartStrings.PropertyPane.SettingsGroup.DescriptionFieldLabel,
          multiline: true,
        })
      );
    }

    return settingsFields;
  }

  private _getConfigurationFields(): IPropertyPaneField<any>[] {
    const configurationFields: IPropertyPaneField<any>[] = [
      PropertyPaneChoiceGroup("configurationType", {
        label: webPartStrings.PropertyPane.ConfigurationGroup.ConfigurationType,
        options: [
          {
            key: ConfigurationTypeOptions.Recommended,
            text: webPartStrings.PropertyPane.ConfigurationGroup
              .ConfigurationTypeOptions.Recommended,
          },
          {
            key: ConfigurationTypeOptions.Custom,
            text: webPartStrings.PropertyPane.ConfigurationGroup
              .ConfigurationTypeOptions.Custom,
          },
        ],
      }),
    ];

    return configurationFields;
  }

  private _getAppearanceFields(): IPropertyPaneField<any>[] {
    const appearanceFields: IPropertyPaneField<any>[] = [
      PropertyPaneTextField("buttonText", {
        label:
          webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
            .TextFieldLabel,
      }),

      PropertyPaneDropdown("buttonAppearance", {
        label:
          webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
            .AppearanceFieldLabel,
        options: [
          {
            key: ButtonAppearanceOptions.NoOutline,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.AppearanceOptions.NoOutline,
          },
          {
            key: ButtonAppearanceOptions.Outline,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.AppearanceOptions.Outline,
          },
          {
            key: ButtonAppearanceOptions.FillColor,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.AppearanceOptions.FillColor,
          },
        ],
        selectedKey: this.properties.buttonAppearance,
      }),

      PropertyPaneDropdown("iconPlacement", {
        label:
          webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
            .IconPlacementFieldLabel,
        options: [
          {
            key: IconPlacementOptions.NoIcon,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.IconPlacementOptions.NoIcon,
          },
          {
            key: IconPlacementOptions.OnlyIcon,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.IconPlacementOptions.OnlyIcon,
          },
          {
            key: IconPlacementOptions.IconOnLeft,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.IconPlacementOptions.IconOnLeft,
          },
          {
            key: IconPlacementOptions.IconOnRight,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.IconPlacementOptions.IconOnRight,
          },
        ],
        selectedKey: this.properties.iconPlacement,
      }),
    ];

    if (this.properties.iconPlacement === IconPlacementOptions.OnlyIcon) {
      appearanceFields.push(
        PropertyPaneSlider("buttonBorderRadius", {
          min: 1,
          max: 50,
          showValue: true,
          step: 1,
          label:
            webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
              .BorderRadiusFieldLabel,
        })
      );
    }

    if (this.properties.iconPlacement !== IconPlacementOptions.NoIcon) {
      appearanceFields.push();
    }

    return appearanceFields;
  }

  private _getAttendanceListFields(): IPropertyPaneField<any>[] {
    const attendanceListFields: IPropertyPaneField<any>[] = [
      PropertyPaneChoiceGroup("attendanceListConfiguration", {
        label:
          webPartStrings.PropertyPane.AttendanceListGroup.ConfigurationType,
        options: [
          {
            key: ConfigurationTypeOptions.Recommended,
            text: webPartStrings.PropertyPane.AttendanceListGroup
              .ConfigurationTypeOptions.Recommended,
          },
          {
            key: ConfigurationTypeOptions.Custom,
            text: webPartStrings.PropertyPane.AttendanceListGroup
              .ConfigurationTypeOptions.Custom,
          },
        ],
      }),
    ];

    return attendanceListFields;
  }
}
