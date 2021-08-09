import * as React from "react";
import styles from "./ArkitektzAttendance.module.scss";
import { IArkitektzAttendanceProps } from "./IArkitektzAttendanceProps";
import { escape } from "@microsoft/sp-lodash-subset";
import SiteService from "../../../services/SiteService";

export default function ArkitektzAttendance(props: IArkitektzAttendanceProps) {
  // const siteService = new SiteService(props.context);
  // const [value, setValue] = React.useState(parseInt(props.initialValue));

  // React.useEffect(() => {
  //   console.log(siteService.get());
  // }, []);

  return (
    <div className={styles.arkitektzAttendance}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.column}>
            <span className={styles.title}>
              Welcome to SharePoint!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
