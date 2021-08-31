import * as React from "react";
import styles from "./Text.module.scss";
import { ITextProps } from "./ITextProps";

export default function Text(props: ITextProps) {
  const { description } = props;

  return (
    <div className={styles.textContainer}>
      <p>{description}</p>
    </div>
  );
}
