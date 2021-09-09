import * as React from "react";
import styles from "./ArkitektzAttendance.module.scss";
import { IArkitektzAttendanceProps } from "./IArkitektzAttendanceProps";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import FileService from "../../../services/FileService";
import ListService from "../../../services/ListService";
import UserService from "../../../services/UserService";
import Text from "./Text/Text";
import Button from "./Button/Button";
import { LocationLabelOptions, StatusOptions } from "../../../models/Options";
import { toISOString } from "./../../../utils/dateUtils";
import {
  calculateDistance,
  getCurrentCoordinates,
} from "./../../../utils/geoLocationUtils";
import { IAttendanceListItem } from "../../../models/IAttendanceListItem";
import { IGeoLocation } from "./../../../models/IGeoLocation";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { LogFileInfo } from "../../../config/config";

export default function ArkitektzAttendance(props: IArkitektzAttendanceProps) {
  const {
    webpartConfiguration,
    context,
    useGeoLocation,
    showDescription,
    description,
    buttonText,
    attendanceListSourceConfigurationType,
    attendanceListSourceSite,
    attendanceListName,
    attendanceListUserColumn,
    attendanceListTimeinColumn,
    attendanceListTimeoutColumn,
    usersListSourceConfigurationType,
    usersListSourceSite,
    usersListName,
    usersListTitleColumn,
    usersListOfficeLocationCoordinatesColumn,
  } = props;

  const [status, setStatus] = React.useState<StatusOptions>(
    StatusOptions.Timein
  );
  const [item, setItem] = React.useState<IAttendanceListItem>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(null);
  const [locationError, setLocationError] = React.useState<string>(null);
  const [userOfficeLocation, setUserOfficeLocation] = React.useState(null);

  const listService = new ListService(context);
  const userService = new UserService(context);
  const fileService = new FileService(context);

  const onTimein = async () => {
    if (!error) {
      setLoading(true);

      const currentUser = await userService.getCurrentUserByEmail(
        webpartConfiguration.attendanceListSiteURL
      );

      const attendanceListItem: IAttendanceListItem = {
        userId: currentUser.Id,
        timein: toISOString(new Date()),
      };

      if (useGeoLocation && userOfficeLocation) {
        const currentCoordinates: IGeoLocation = await getCurrentCoordinates();
        const { distance }: IGeoLocation = calculateDistance({
          latitude1: currentCoordinates.latitude,
          longitude1: currentCoordinates.longitude,
          latitude2: userOfficeLocation.latitude,
          longitude2: userOfficeLocation.longitude,
        });

        attendanceListItem.locationCoordinates = `${currentCoordinates.latitude}, ${currentCoordinates.longitude}`;
        attendanceListItem.locationLabel =
          distance > props.radius
            ? LocationLabelOptions.Remotely
            : LocationLabelOptions.Office;
        setError(null);
      } else {
        if (!useGeoLocation) {
          attendanceListItem.locationLabel =
            webpartConfiguration.noLocationLabel;
        } else if (!userOfficeLocation) {
          attendanceListItem.locationLabel = webpartConfiguration.noOfficeLabel;
        }
      }

      const { entity, errorDetails } = await listService.saveListItem(
        webpartConfiguration,
        attendanceListItem
      );
      if (entity) {
        setStatus(StatusOptions.Timeout);
        setItem(entity);
        setError(null);
      } else {
        setError(errorDetails.clientMessage);
        await fileService.updateLogFileContent(
          errorDetails.errorObj,
          LogFileInfo.fullPath
        );
      }

      setLoading(false);
    }
  };

  const onTimeout = async () => {
    setLoading(true);

    const attendanceListItem: IAttendanceListItem = {
      id: item.id,
      timeout: toISOString(new Date()),
      timein: item.timein,
    };

    const { entity, errorDetails } = await listService.updateListItem(
      webpartConfiguration,
      attendanceListItem
    );

    if (entity) {
      setStatus(StatusOptions.Timein);
      setItem(null);
      setError(null);
    } else {
      setError(errorDetails.clientMessage);
      await fileService.updateLogFileContent(
        errorDetails.errorObj,
        LogFileInfo.fullPath
      );
    }

    setLoading(false);
  };

  const onButtonClick = async () => {
    if (status === StatusOptions.Timein) {
      onTimein();
    } else if (StatusOptions.Timeout) {
      onTimeout();
    }
  };

  const getAttendance = async () => {
    setLoading(true);

    const { entity, errorDetails } = await listService.getAttendanceListItems(
      webpartConfiguration
    );
    if (!entity && !errorDetails) {
      setError(null);
    }
    if (entity) {
      setStatus(StatusOptions.Timeout);
      setItem(entity);
      setError(null);
    }
    if (errorDetails) {
      setError(errorDetails.clientMessage);
      await fileService.updateLogFileContent(
        errorDetails.errorObj,
        LogFileInfo.fullPath
      );
    }

    setLoading(false);
  };

  const getUserOfficeLocation = async () => {
    setLoading(true);

    const { entity, errorDetails } = await listService.getUserListItems(
      webpartConfiguration
    );
    if (!entity && !errorDetails) {
      setLocationError(null);
    }

    if (entity) {
      setUserOfficeLocation(entity.officeLocationCoordinates);
      setLocationError(null);
    }
    if (errorDetails) {
      setLocationError(errorDetails.clientMessage);
      await fileService.updateLogFileContent(
        errorDetails.errorObj,
        LogFileInfo.fullPath
      );
    }

    setLoading(false);
  };

  const _onConfigure = () => {
    props.context.propertyPane.open();
  };

  const getButtonLayoutClass = () => {
    return showDescription ? styles.columnButton : styles.columnOnlyButton;
  };

  React.useEffect(() => {
    if (attendanceListSourceConfigurationType) {
      getAttendance();
    }
  }, [
    attendanceListSourceConfigurationType,
    attendanceListSourceSite,
    attendanceListName,
    attendanceListUserColumn,
    attendanceListTimeinColumn,
    attendanceListTimeoutColumn,
  ]);

  React.useEffect(() => {
    if (useGeoLocation) {
      getUserOfficeLocation();
    } else {
      setLocationError(null);
    }
  }, [
    useGeoLocation,
    usersListSourceConfigurationType,
    usersListSourceSite,
    usersListName,
    usersListTitleColumn,
    usersListOfficeLocationCoordinatesColumn,
  ]);

  if (!attendanceListSourceConfigurationType) {
    return (
      <Placeholder
        iconName="Edit"
        iconText="Configure the web part"
        description="Please configure the web part"
        buttonLabel="Configure"
        onConfigure={_onConfigure}
      />
    );
  }

  return (
    <div className={styles.arkitektzAttendance}>
      <div className={styles.container}>
        <div
          className={styles.row}
          style={{
            backgroundColor: props.themeVariant.semanticColors.bodyBackground,
          }}
        >
          {error && (
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          )}
          {!error && locationError && (
            <MessageBar messageBarType={MessageBarType.error}>
              {locationError}
            </MessageBar>
          )}
          <br />
          {showDescription && (
            <div className={styles.columnText}>
              <Text description={description} />
            </div>
          )}

          <div className={getButtonLayoutClass()}>
            <div className={styles.row}>
              <Button
                label={buttonText}
                timein={item ? item.timein : ""}
                status={status}
                loading={loading}
                uiOptions={{
                  appearance: props.buttonAppearance,
                  borderRadius: props.buttonBorderRadius,
                  alignment: props.buttonAlignment,
                  iconPlacement: props.iconPlacement,
                  selectedIcon: props.selectedIcon,
                }}
                onButtonClick={onButtonClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
