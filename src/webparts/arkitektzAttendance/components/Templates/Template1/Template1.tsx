import * as React from "react";

import { ITemplate1Props } from "./ITemplate1Props";
import Text from "../../../components/Text/Text";

import styles from "./Template1.module.scss";

const Template1 = (props: ITemplate1Props) => {
  const { showDescription, description, themeVariant, children } = props;

  const getButtonLayoutClass = () => {
    return showDescription ? styles.columnButton : styles.columnOnlyButton;
  };

  return (
    <div
      className={styles.row}
      style={{
        backgroundColor: themeVariant.semanticColors.bodyBackground,
      }}
    >
      {showDescription && (
        <div className={styles.columnText}>
          <Text description={description} />
        </div>
      )}

      <div className={getButtonLayoutClass()}>
        <div className={styles.row}>{children}</div>
      </div>
    </div>
  );
};

export default Template1;
