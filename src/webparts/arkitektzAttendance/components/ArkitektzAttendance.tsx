import * as React from "react";
import styles from "./ArkitektzAttendance.module.scss";
import { IArkitektzAttendanceProps } from "./IArkitektzAttendanceProps";
import { escape } from "@microsoft/sp-lodash-subset";
import SiteService from "../../../services/SiteService";
import FileService from "../../../services/FileService";
import ListService from "../../../services/ListService";
import UserService from "../../../services/UserService";
import Text from "./Text/Text";
import Button from "./Button/Button";
import { LocationLabelOptions, StatusOptions } from "../../../models/Options";
import { to12HourFormat, toISOString } from "./../../../utils/dateUtils";
import {
  calculateDistance,
  getCurrentCoordinates,
} from "./../../../utils/geoLocationUtils";
import { IAttendanceListItem } from "../../../models/IAttendanceListItem";
import { IGeoLocation } from "./../../../models/IGeoLocation";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { IUser } from "./../../../models/IUser";

export default function ArkitektzAttendance(props: IArkitektzAttendanceProps) {
  const [status, setStatus] = React.useState<StatusOptions>(
    StatusOptions.Timein
  );
  const [item, setItem] = React.useState<IAttendanceListItem>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    webpartConfiguration,
    context,
    useGeoLocation,
    showDescription,
    description,
    buttonText,
  } = props;

  console.log(props);
  

  const listService = new ListService(context);
  const userService = new UserService(context);

  const getButtonLayoutClass = () => {
    return showDescription ? styles.columnButton : styles.columnOnlyButton;
  };

  const onTimein = async () => {
    setLoading(true);

    const currentUser = await userService.getCurrentUserByEmail(
      webpartConfiguration.attendanceListSiteURL
    );
    const attendanceListItem: IAttendanceListItem = {
      userId: currentUser.Id,
      timein: toISOString(new Date()),
    };
    let locationLabel: string = "";
    if (useGeoLocation) {
      const currentCoordinates: IGeoLocation = await getCurrentCoordinates();
      const user: IUser = await listService.getUserListItems(
        webpartConfiguration
      );

      const { distance }: IGeoLocation = calculateDistance({
        latitude1: currentCoordinates.latitude,
        longitude1: currentCoordinates.longitude,
        latitude2: user.officeLocationCoordinates.latitude,
        longitude2: user.officeLocationCoordinates.longitude,
      });
      console.log(distance);

      attendanceListItem.locationCoordinates = `${currentCoordinates.latitude}, ${currentCoordinates.longitude}`;
      locationLabel =
        distance > props.radius
          ? LocationLabelOptions.Remotely
          : LocationLabelOptions.Office;
    } else {
      locationLabel = webpartConfiguration.noLocationLabel;
    }

    attendanceListItem.locationLabel = locationLabel;
    const result = await listService.saveListItem(
      webpartConfiguration,
      attendanceListItem
    );
    if (result) {
      setStatus(StatusOptions.Timeout);
      setItem(result);
    }
    setLoading(false);
  };

  const onTimeout = async () => {
    setLoading(true);

    const attendanceListItem: IAttendanceListItem = {
      id: item.id,
      timeout: toISOString(new Date()),
      timein: item.timein,
    };

    const result = await listService.updateListItem(
      webpartConfiguration,
      attendanceListItem
    );

    if (result) {
      setStatus(StatusOptions.Timein);
      setItem(null);
    } else {
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
    const result = await listService.getAttendanceListItems(
      webpartConfiguration
    );

    if (result) {
      setStatus(StatusOptions.Timeout);
      setItem(result);
    }
    setLoading(false);
  };

  const _onConfigure = () => {
    props.context.propertyPane.open();
  };

  React.useEffect(() => {
    getAttendance();
  }, []);

  React.useEffect(() => {
    console.log(status, item, loading, "state");
  }, [status, item, loading]);

  if (!props.attendanceListSourceConfigurationType) {
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
        <div className={styles.row}>
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
