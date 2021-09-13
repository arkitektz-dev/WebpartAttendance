import * as React from "react";
import * as moment from "moment";

import { ITemplate2Props } from "./ITemplate2Props";

import layoutStyles from "./Template2.module.scss";

const Template1 = (props: ITemplate2Props) => {
  const { item, buttonText, children } = props;

  return (
    <div className={layoutStyles.layout}>
      <div className={layoutStyles.container}>
        <div className={layoutStyles.card}>
          <div className={layoutStyles.cardBody}>
            {item && (
              <p className={layoutStyles.cardTitle}>
                {`${buttonText.split(",")[0]}`} at -
                <span className={layoutStyles.checkInDate}>{`${moment(
                  new Date()
                ).format("dddd, Do MMMM YYYY")} `}</span>
                <span className={layoutStyles.checkInTime}>{`${moment(
                  item.timein
                ).format("h:mm A")}`}</span>
              </p>
            )}
            <div className={layoutStyles.punchInfo}>
              <div className={layoutStyles.punchHours}>
                <span>{`${moment(new Date()).format("dddd")}`}</span>
              </div>
            </div>
            <div className={layoutStyles.punchBtnSection}>
              {children}
              {/* <Button
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
                      layout={layout}
                    /> */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template1;
