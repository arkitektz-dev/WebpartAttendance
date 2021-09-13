import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme,
} from "@microsoft/sp-component-base";
import {
  IPropertyPaneField,
  PropertyPaneLabel,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup,
  IPropertyPaneConfiguration,
} from "@microsoft/sp-property-pane";
import { PropertyFieldIconPicker } from "@pnp/spfx-property-controls/lib/PropertyFieldIconPicker";
import {
  PropertyFieldSitePicker,
  IPropertyFieldSite,
} from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";

import { PropertyPaneAsyncDropdown } from "../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown";
import * as webPartStrings from "ArkitektzAttendanceWebPartStrings";
import ArkitektzAttendance from "./components/ArkitektzAttendance";
import { IArkitektzAttendanceProps } from "./components/IArkitektzAttendanceProps";
import {
  IconPlacementOptions,
  ButtonAppearanceOptions,
  ButtonAlignmentOptions,
  ConfigurationTypeOptions,
  LayoutOptions,
} from "../../models/Options";
import { IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";
import { update, get } from "@microsoft/sp-lodash-subset";
import FileService from "../../services/FileService";
import ListService from "../../services/ListService";
import { IWebpartConfiguration } from "./../../models/IWebpartConfiguration";
import {
  ConfigurationFileInfo,
  WebpartConfiguration,
  LogFileInfo,
} from "./../../config/config";

const layout1Svg: string = require("./components/assets/layout1.svg");
const layout2Svg: string = require("./components/assets/layout2.svg");

export interface IArkitektzAttendanceWebPartProps {
  webpartConfiguration: IWebpartConfiguration;

  //settings
  showDescription: boolean;
  description: string;

  //configuration
  useGeoLocation: boolean;
  radius: number;
  usersListSourceConfigurationType: ConfigurationTypeOptions;
  usersListSourceSite: IPropertyFieldSite[];
  usersListName: string;
  usersListTitleColumn: string;
  usersListOfficeLocationCoordinatesColumn: string;
  usersListOfficeLatitudeColumn: string;
  usersListOfficeLongitudeColumn: string;
  layout: string;

  //appearance
  buttonText: string;
  buttonAppearance: string;
  buttonBorderRadius: number;
  buttonAlignment: string;
  iconPlacement: string;
  selectedIcon: string;

  //attendance source
  attendanceListSourceConfigurationType: ConfigurationTypeOptions;
  attendanceListSourceSite: IPropertyFieldSite[];
  attendanceListName: string;
  attendanceListUserColumn: string;
  attendanceListTimeinColumn: string;
  attendanceListTimeoutColumn: string;
  attendanceListLocationCoordinatesColumn: string;
  attendanceListLocationLabelColumn: string;
}

export default class ArkitektzAttendanceWebPart extends BaseClientSideWebPart<IArkitektzAttendanceWebPartProps> {
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  private _webpartConfiguration: IWebpartConfiguration = null;

  protected async onInit(): Promise<void> {
    this._themeProvider = this.context.serviceScope.consume(
      ThemeProvider.serviceKey
    );
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(
      this,
      this._handleThemeChangedEvent
    );

    const fileService = new FileService(this.context);

    const isFolderExist = await fileService.checkFolderExist(
      ConfigurationFileInfo.uploadPath
    );

    if (!isFolderExist) {
      await fileService.addFolder(ConfigurationFileInfo.folderName);
    }

    const isFileExist = await fileService.checkFileExist(
      ConfigurationFileInfo.fullPath
    );

    if (!isFileExist) {
      const fileObj = new File(
        [JSON.stringify(WebpartConfiguration)],
        ConfigurationFileInfo.nameWithExt,
        {
          type: "application/json",
        }
      );

      await fileService.addFile(fileObj, ConfigurationFileInfo.uploadPath);

      this.properties.webpartConfiguration = WebpartConfiguration;
      this._webpartConfiguration = WebpartConfiguration;
    } else {
      const file: IWebpartConfiguration = await fileService.readFile(
        ConfigurationFileInfo.fullPath
      );
      this._webpartConfiguration = file;
    }

    const isLogFileExist = await fileService.checkFileExist(
      LogFileInfo.fullPath
    );

    if (!isLogFileExist) {
      const fileObj = new File([""], LogFileInfo.nameWithExt, {
        type: "text/plain",
      });

      await fileService.addFile(fileObj, ConfigurationFileInfo.uploadPath);
    }

    this.initializeProperties();

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IArkitektzAttendanceProps> =
      React.createElement(ArkitektzAttendance, {
        webpartConfiguration: this.properties.webpartConfiguration,
        context: this.context,
        //settings
        showDescription: this.properties.showDescription,
        description: this.properties.description,
        //configuration
        useGeoLocation: this.properties.useGeoLocation,
        radius: this.properties.radius,
        usersListSourceConfigurationType:
          this.properties.usersListSourceConfigurationType,
        usersListSourceSite: this.properties.usersListSourceSite,
        usersListName: this.properties.usersListName,
        usersListTitleColumn: this.properties.usersListTitleColumn,
        usersListOfficeLocationCoordinatesColumn:
          this.properties.usersListOfficeLocationCoordinatesColumn,
        layout: this.properties.layout,
        //appearance
        buttonText: this.properties.buttonText,
        buttonAppearance: this.properties.buttonAppearance,
        buttonBorderRadius: this.properties.buttonBorderRadius,
        buttonAlignment: this.properties.buttonAlignment,
        iconPlacement: this.properties.iconPlacement,
        selectedIcon: this.properties.selectedIcon,
        //attendance source
        attendanceListSourceConfigurationType:
          this.properties.attendanceListSourceConfigurationType,
        attendanceListSourceSite: this.properties.attendanceListSourceSite,
        attendanceListName: this.properties.attendanceListName,
        attendanceListUserColumn: this.properties.attendanceListUserColumn,
        attendanceListTimeinColumn: this.properties.attendanceListTimeinColumn,
        attendanceListTimeoutColumn:
          this.properties.attendanceListTimeoutColumn,
        attendanceListLocationCoordinatesColumn:
          this.properties.attendanceListLocationCoordinatesColumn,
        attendanceListLocationLabelColumn:
          this.properties.attendanceListLocationLabelColumn,

        //theme
        themeVariant: this._themeVariant,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  private initializeProperties() {
    //settings

    //appearance
    this.properties.buttonAppearance =
      this.properties.buttonAppearance || ButtonAppearanceOptions.FillColor;

    this.properties.buttonAlignment =
      this.properties.buttonAlignment || ButtonAlignmentOptions.Center;

    this.properties.iconPlacement =
      this.properties.iconPlacement || IconPlacementOptions.NoIcon;

    //configuration
    this.properties.usersListSourceConfigurationType =
      this.properties.usersListSourceConfigurationType ||
      ConfigurationTypeOptions.Recommended;

    this.properties.layout = this.properties.layout || LayoutOptions.Layout1;

    this.properties.usersListSourceSite =
      this.properties.usersListSourceSite || [];

    //attendance source
    this.properties.attendanceListSourceSite =
      this.properties.attendanceListSourceSite || [];

    //
    this.properties.webpartConfiguration =
      this._makeWebpartConfigurationObject();
  }

  private async loadAttendanceSourceListOptions(): Promise<IDropdownOption[]> {
    const siteUrl = this.properties.attendanceListSourceSite[0].url;
    const listService = new ListService(this.context);
    const result = await listService.getLists(siteUrl);

    const listOptions: IDropdownOption[] = result.map((item) => ({
      key: item.title,
      text: item.title,
    }));

    return new Promise<IDropdownOption[]>(
      (
        resolve: (options: IDropdownOption[]) => void,
        reject: (error: any) => void
      ) => {
        resolve(listOptions);
      }
    );
  }

  private async loadAttendanceSourceListColumnOptions(
    fieldType: string
  ): Promise<IDropdownOption[]> {
    const siteUrl = this.properties.attendanceListSourceSite[0].url;
    const listTitle = this.properties.attendanceListName;
    const listService = new ListService(this.context);

    const result = await listService.getListColumns(siteUrl, listTitle);
    const listColumnOptions: IDropdownOption[] = result
      .filter((item) => item.type === fieldType)
      .map((item) => ({
        key: item.internalName,
        text: item.title,
      }));
    return new Promise<IDropdownOption[]>(
      (
        resolve: (options: IDropdownOption[]) => void,
        reject: (error: any) => void
      ) => {
        resolve(listColumnOptions);
      }
    );
  }

  private async loadConfigurationListOptions(): Promise<IDropdownOption[]> {
    const siteUrl = this.properties.usersListSourceSite[0].url;
    const listService = new ListService(this.context);
    const result = await listService.getLists(siteUrl);
    const listOptions: IDropdownOption[] = result.map((item) => ({
      key: item.title,
      text: item.title,
    }));

    return new Promise<IDropdownOption[]>(
      (
        resolve: (options: IDropdownOption[]) => void,
        reject: (error: any) => void
      ) => {
        resolve(listOptions);
      }
    );
  }

  private async loadConfigurationListColumnOptions(
    fieldType: string
  ): Promise<IDropdownOption[]> {
    const siteUrl = this.properties.usersListSourceSite[0].url;
    const listTitle = this.properties.usersListName;
    const listService = new ListService(this.context);
    const result = await listService.getListColumns(siteUrl, listTitle);
    const listColumnOptions: IDropdownOption[] = result
      .filter((item) => item.type === fieldType)
      .map((item) => ({
        key: item.internalName,
        text: item.title,
      }));

    return new Promise<IDropdownOption[]>(
      (
        resolve: (options: IDropdownOption[]) => void,
        reject: (error: any) => void
      ) => {
        resolve(listColumnOptions);
      }
    );
  }

  private onAsyncDropdownChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => {
      return newValue;
    });
    this.properties.webpartConfiguration =
      this._makeWebpartConfigurationObject();

    if (
      propertyPath === "attendanceListName" ||
      propertyPath === "usersListName"
    ) {
      this.context.propertyPane.refresh();
    }

    this.render();
    // refresh web part
  }

  private _makeWebpartConfigurationObject(): any {
    const obj: any = {};

    if (
      this.properties.usersListSourceConfigurationType ===
      ConfigurationTypeOptions.Custom
    ) {
      obj.usersListSiteURL = this.properties.usersListSourceSite[0]?.url;
      obj.usersListName = this.properties.usersListName;
      obj.usersListTitleColumn = this.properties.usersListTitleColumn;
      obj.usersListOfficeLocationCoordinatesColumn =
        this.properties.usersListOfficeLocationCoordinatesColumn;
      obj.usersListOfficeLatitudeColumn =
        this.properties.usersListOfficeLatitudeColumn;
      obj.usersListOfficeLongitudeColumn =
        this.properties.usersListOfficeLongitudeColumn;
    } else {
      obj.usersListSiteURL = this._webpartConfiguration.usersListSiteURL;
      obj.usersListName = this._webpartConfiguration.usersListName;
      obj.usersListTitleColumn =
        this._webpartConfiguration.usersListTitleColumn;
      obj.usersListOfficeLocationCoordinatesColumn =
        this._webpartConfiguration.usersListOfficeLocationCoordinatesColumn;
    }

    if (
      this.properties.attendanceListSourceConfigurationType ===
      ConfigurationTypeOptions.Custom
    ) {
      obj.attendanceListSiteURL =
        this.properties.attendanceListSourceSite[0]?.url;
      obj.attendanceListName = this.properties.attendanceListName;
      obj.attendanceListUserColumn = this.properties.attendanceListUserColumn;
      obj.attendanceListTimeinColumn =
        this.properties.attendanceListTimeinColumn;
      obj.attendanceListTimeoutColumn =
        this.properties.attendanceListTimeoutColumn;

      obj.attendanceListLocationCoordinatesColumn =
        this.properties.attendanceListLocationCoordinatesColumn;
      obj.attendanceListLocationLabelColumn =
        this.properties.attendanceListLocationLabelColumn;
    } else {
      obj.attendanceListSiteURL =
        this._webpartConfiguration.attendanceListSiteURL;
      obj.attendanceListName = this._webpartConfiguration.attendanceListName;
      obj.attendanceListUserColumn =
        this._webpartConfiguration.attendanceListUserColumn;
      obj.attendanceListTimeinColumn =
        this._webpartConfiguration.attendanceListTimeinColumn;
      obj.attendanceListTimeoutColumn =
        this._webpartConfiguration.attendanceListTimeoutColumn;
      obj.attendanceListLocationCoordinatesColumn =
        this._webpartConfiguration.attendanceListLocationCoordinatesColumn;
      obj.attendanceListLocationLabelColumn =
        this._webpartConfiguration.attendanceListLocationLabelColumn;
    }

    obj.noLocationLabel = this._webpartConfiguration.noLocationLabel;
    obj.noOfficeLabel = this._webpartConfiguration.noOfficeLabel;

    return obj;
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): void {
    if (propertyPath === "attendanceListSourceConfigurationType") {
      this.properties.webpartConfiguration =
        this._makeWebpartConfigurationObject();
    }

    if (propertyPath === "usersListSourceConfigurationType") {
      this.properties.webpartConfiguration =
        this._makeWebpartConfigurationObject();
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName:
                webPartStrings.PropertyPane.AttendanceSourceGroup.GroupName,
              groupFields: this._getAttendanceSourceFields(),
              isCollapsed: false,
            },
            {
              groupName:
                webPartStrings.PropertyPane.ConfigurationGroup.GroupName,
              groupFields: this._getConfigurationFields(),
              isCollapsed: true,
            },
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
          ],
        },
      ],
    };
  }

  private _getAttendanceSourceFields(): IPropertyPaneField<any>[] {
    const attendanceSourceFields: IPropertyPaneField<any>[] = [
      PropertyPaneChoiceGroup("attendanceListSourceConfigurationType", {
        label:
          webPartStrings.PropertyPane.AttendanceSourceGroup.ConfigurationType,
        options: [
          {
            key: ConfigurationTypeOptions.Recommended,
            text: webPartStrings.PropertyPane.AttendanceSourceGroup
              .ConfigurationTypeOptions.Recommended,
          },
          {
            key: ConfigurationTypeOptions.Custom,
            text: webPartStrings.PropertyPane.AttendanceSourceGroup
              .ConfigurationTypeOptions.Custom,
          },
        ],
      }),
    ];

    if (
      this.properties.attendanceListSourceConfigurationType ===
      ConfigurationTypeOptions.Custom
    ) {
      attendanceSourceFields.push(
        PropertyFieldSitePicker("attendanceListSourceSite", {
          label:
            webPartStrings.PropertyPane.AttendanceSourceGroup.SiteFieldLabel,
          initialSites: this.properties.attendanceListSourceSite,
          context: this.context,
          deferredValidationTime: 500,
          multiSelect: false,
          onPropertyChange: this.onPropertyPaneFieldChanged,
          properties: this.properties,
          key: "attendanceSourceSiteFieldId",
        })
      );

      if (this.properties.attendanceListSourceSite.length > 0) {
        attendanceSourceFields.push(
          new PropertyPaneAsyncDropdown("attendanceListName", {
            label:
              webPartStrings.PropertyPane.AttendanceSourceGroup.ListFieldLabel,
            loadOptions: this.loadAttendanceSourceListOptions.bind(this),
            onPropertyChange: this.onAsyncDropdownChange.bind(this),
            selectedKey: this.properties.attendanceListName,
          })
        );
      }

      if (this.properties.attendanceListName) {
        attendanceSourceFields.push(
          new PropertyPaneAsyncDropdown("attendanceListUserColumn", {
            label:
              webPartStrings.PropertyPane.AttendanceSourceGroup
                .UserColumnFieldLabel,
            loadOptions: () =>
              this.loadAttendanceSourceListColumnOptions("SP.FieldUser"),
            onPropertyChange: this.onAsyncDropdownChange.bind(this),
            selectedKey: this.properties.attendanceListUserColumn,
            helpText: "This is user column",
          }),

          new PropertyPaneAsyncDropdown("attendanceListTimeinColumn", {
            label:
              webPartStrings.PropertyPane.AttendanceSourceGroup
                .TimeinColumnFieldLabel,
            loadOptions: () =>
              this.loadAttendanceSourceListColumnOptions("SP.FieldDateTime"),
            onPropertyChange: this.onAsyncDropdownChange.bind(this),
            selectedKey: this.properties.attendanceListTimeinColumn,
            helpText: "This is time in column",
          }),

          new PropertyPaneAsyncDropdown("attendanceListTimeoutColumn", {
            label:
              webPartStrings.PropertyPane.AttendanceSourceGroup
                .TimeoutColumnFieldLabel,
            loadOptions: () =>
              this.loadAttendanceSourceListColumnOptions("SP.FieldDateTime"),
            onPropertyChange: this.onAsyncDropdownChange.bind(this),
            selectedKey: this.properties.attendanceListTimeoutColumn,
            helpText: "This is time out column",
          }),

          new PropertyPaneAsyncDropdown("attendanceListLocationLabelColumn", {
            label:
              webPartStrings.PropertyPane.AttendanceSourceGroup
                .LocationLabelColumnFieldLabel,
            loadOptions: () =>
              this.loadAttendanceSourceListColumnOptions("SP.FieldText"),
            onPropertyChange: this.onAsyncDropdownChange.bind(this),
            selectedKey: this.properties.attendanceListLocationLabelColumn,
            helpText: "This is from column",
          }),

          new PropertyPaneAsyncDropdown(
            "attendanceListLocationCoordinatesColumn",
            {
              label:
                webPartStrings.PropertyPane.AttendanceSourceGroup
                  .LocationCoordinatesColumnFieldLabel,
              loadOptions: () =>
                this.loadAttendanceSourceListColumnOptions("SP.FieldText"),
              onPropertyChange: this.onAsyncDropdownChange.bind(this),
              selectedKey:
                this.properties.attendanceListLocationCoordinatesColumn,
              helpText: "This is office-coordinates column",
            }
          )
        );
      }
    }

    return attendanceSourceFields;
  }

  private _getConfigurationFields(): IPropertyPaneField<any>[] {
    const configurationFields: IPropertyPaneField<any>[] = [
      PropertyPaneToggle("useGeoLocation", {
        label:
          webPartStrings.PropertyPane.ConfigurationGroup
            .UseGeoLocationFieldLabel,
      }),
    ];

    if (this.properties.useGeoLocation) {
      configurationFields.push(
        PropertyFieldNumber("radius", {
          key: "radius",
          label:
            webPartStrings.PropertyPane.ConfigurationGroup.RadiusFieldLabel,
          description: "This field calculates the radius in meters",
          value: this.properties.radius,
          // maxValue: 10,
          // minValue: 1,
          // disabled: false
        }),
        PropertyPaneChoiceGroup("usersListSourceConfigurationType", {
          label:
            webPartStrings.PropertyPane.ConfigurationGroup.ConfigurationType,
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
        })
      );

      if (
        this.properties.usersListSourceConfigurationType ===
        ConfigurationTypeOptions.Custom
      ) {
        configurationFields.push(
          PropertyFieldSitePicker("usersListSourceSite", {
            label:
              webPartStrings.PropertyPane.ConfigurationGroup.SiteFieldLabel,
            initialSites: this.properties.usersListSourceSite,
            context: this.context,
            deferredValidationTime: 500,
            multiSelect: false,
            onPropertyChange: this.onPropertyPaneFieldChanged,
            properties: this.properties,
            key: "configurationSiteFieldId",
          })
        );

        if (this.properties.usersListSourceSite.length > 0) {
          configurationFields.push(
            new PropertyPaneAsyncDropdown("usersListName", {
              label:
                webPartStrings.PropertyPane.ConfigurationGroup.ListFieldLabel,
              loadOptions: this.loadConfigurationListOptions.bind(this),
              onPropertyChange: this.onAsyncDropdownChange.bind(this),
              selectedKey: this.properties.usersListName,
            })
          );
        }

        if (this.properties.usersListName) {
          configurationFields.push(
            new PropertyPaneAsyncDropdown("usersListTitleColumn", {
              label:
                webPartStrings.PropertyPane.ConfigurationGroup
                  .UserColumnFieldLabel,
              loadOptions: () =>
                this.loadConfigurationListColumnOptions("SP.FieldUser"),
              onPropertyChange: this.onAsyncDropdownChange.bind(this),
              selectedKey: this.properties.usersListTitleColumn,
            }),
            PropertyPaneLabel("labelField4", {
              text: "This is user column",
              required: true,
            }),
            new PropertyPaneAsyncDropdown(
              "usersListOfficeLocationCoordinatesColumn",
              {
                label:
                  webPartStrings.PropertyPane.ConfigurationGroup
                    .OfficeLocationCoordinatesColumnFieldLabel,
                loadOptions: () =>
                  this.loadConfigurationListColumnOptions("SP.FieldText"),
                onPropertyChange: this.onAsyncDropdownChange.bind(this),
                selectedKey:
                  this.properties.usersListOfficeLocationCoordinatesColumn,
              }
            ),
            PropertyPaneLabel("labelField5", {
              text: "This is office location column",
              required: true,
            })
          );
        }
      }
    }

    return configurationFields;
  }

  private _getSettingsFields(): IPropertyPaneField<any>[] {
    const settingsFields: IPropertyPaneField<any>[] = [
      PropertyPaneToggle("showDescription", {
        label:
          webPartStrings.PropertyPane.SettingsGroup.ShowDesriptionFieldLabel,
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

      PropertyPaneChoiceGroup("buttonAlignment", {
        label:
          webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
            .AlignmentFieldLabel,
        options: [
          {
            key: ButtonAlignmentOptions.Left,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.AlignmentOptions.Left,
          },
          {
            key: ButtonAlignmentOptions.Center,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.AlignmentOptions.Center,
          },
          {
            key: ButtonAlignmentOptions.Right,
            text: webPartStrings.PropertyPane.AppearanceGroup
              .ButtonConfiguration.AlignmentOptions.Right,
          },
        ],
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
      appearanceFields.push(
        PropertyFieldIconPicker("selectedIcon", {
          currentIcon: this.properties.selectedIcon,
          key: "iconPickerId",
          onSave: (icon: string) => {
            this.properties.selectedIcon = icon;
          },
          buttonLabel:
            webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
              .IconPickerFieldButtonLabel,
          renderOption: "panel",
          properties: this.properties,
          onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
          label:
            webPartStrings.PropertyPane.AppearanceGroup.ButtonConfiguration
              .IconPickerFieldLabel,
        })
      );
    }

    appearanceFields.push(
      PropertyPaneChoiceGroup("layout", {
        label: webPartStrings.PropertyPane.AppearanceGroup.LayoutFieldLabel,
        options: [
          {
            key: webPartStrings.PropertyPane.AppearanceGroup.LayoutOptions
              .Layout1,
            text: webPartStrings.PropertyPane.AppearanceGroup.LayoutOptions
              .Layout1,
            selectedImageSrc: layout1Svg,
            imageSrc: layout1Svg,
          },
          {
            key: webPartStrings.PropertyPane.AppearanceGroup.LayoutOptions
              .Layout2,
            text: webPartStrings.PropertyPane.AppearanceGroup.LayoutOptions
              .Layout2,
            selectedImageSrc: layout2Svg,
            imageSrc: layout2Svg,
          },
        ],
      })
    );

    return appearanceFields;
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }
}
