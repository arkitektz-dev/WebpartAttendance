import * as React from "react";
import * as moment from "moment";

import { ITemplate2Props } from "./ITemplate2Props";
import { getCurrentWorkingHours } from "../../../../../utils/dateUtils";
import ApiService from "../../../../../services/ApiService";

import layoutStyles from "./Template2.module.scss";

const Template1 = (props: ITemplate2Props) => {
  const { item, buttonText, children, description } = props;

  const apiService = new ApiService();

  const [currentWorkingHours, setCurrentWorkingHours] = React.useState(null);

  React.useEffect(() => {
    if (item) {
      setCurrentWorkingHours(item.currentWorkingHours);
      const timeInterval = setInterval(async () => {
        const utcRes = await apiService.getUniversalDateTime();
        setCurrentWorkingHours(getCurrentWorkingHours(utcRes, item.timein));
      }, 60000);
      return () => {
        console.log("clear");
        clearInterval(timeInterval);
      };
    }
  }, [item]);

  const checkInDate = `${moment(new Date()).format("ddd, Do MMM YYYY")} `;
  const checkInTime = `${moment(item?.timein).format("h:mm A")}`;

  return (
    <div className={layoutStyles.layout}>
      <div className={layoutStyles.container}>
        <div className={layoutStyles.card}>
          <div className={layoutStyles.cardBody}>
            {description && (
              <div>
                <p>{description}</p>
              </div>
            )}
            <div className={layoutStyles.punchInfo}>
              <div className={layoutStyles.punchHours}>
                <span>
                  {item && currentWorkingHours ? currentWorkingHours : "00:00"}
                </span>
              </div>
            </div>
            <div className={layoutStyles.punchBtnSection}>
              {children}
              {/* <div className={layoutStyles.stats}>
                  <div className={layoutStyles.statsContainer}>
                    <div className={layoutStyles.statsBox}>
                      <p>Break</p>
                      <h6>1.21 hrs</h6>
                    </div>
                    <div className={layoutStyles.statsBox}>
                      <p>Overtime</p>
                      <h6>3 hrs</h6>
                    </div>
                  </div>
                </div> */}
              {item && (
                <div className={layoutStyles.cardFooter}>
                  <span className={layoutStyles.checkInDate}>{`${
                    buttonText.split(",")[0]
                  } at - ${checkInDate}`}</span>
                  <span className={layoutStyles.checkInTime}>
                    {checkInTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;
