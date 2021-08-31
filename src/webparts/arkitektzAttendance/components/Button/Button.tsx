import * as React from "react";
import styles from "./Button.module.scss";
import { IButtonProps } from "./IButtonProps";
import {
  IconPlacementOptions,
  ButtonAppearanceOptions,
  ButtonAlignmentOptions,
} from "./../../../../models/Options";
import { Icon } from "@fluentui/react/lib/Icon";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { StatusOptions } from "./../../../../models/Options";
import { to12HourFormat } from "../../../../utils/dateUtils";

export default function Button(props: IButtonProps) {
  const { label, timein, status, loading, uiOptions, onButtonClick } = props;

  const getStyles = () => {
    let buttonStyles: any = {};

    if (uiOptions.iconPlacement === IconPlacementOptions.OnlyIcon) {
      buttonStyles["borderRadius"] = uiOptions.borderRadius;
    }

    return buttonStyles;
  };

  const getContainerStyles = () => {
    let containerStyles: any = {};

    if (uiOptions.alignment === ButtonAlignmentOptions.Left) {
      containerStyles["textAlign"] = "left";
    } else if (uiOptions.alignment === ButtonAlignmentOptions.Center) {
      containerStyles["textAlign"] = "center";
    } else if (uiOptions.alignment === ButtonAlignmentOptions.Right) {
      containerStyles["textAlign"] = "right";
    }

    return containerStyles;
  };

  const getClasses = () => {
    let cssClasses = "";

    if (uiOptions.appearance === ButtonAppearanceOptions.NoOutline) {
      cssClasses += styles.noOutline;
    } else if (uiOptions.appearance === ButtonAppearanceOptions.Outline) {
      cssClasses += styles.outline;
    } else if (uiOptions.appearance === ButtonAppearanceOptions.FillColor) {
      cssClasses += styles.fillColor;
    }

    return cssClasses;
  };

  const getButtonLabel = () => {
    let buttonLabel: any = "";
    let formattedLabel = "";
    const defaultIcon = "Accept";
    const icon = (
      <Icon
        iconName={uiOptions.selectedIcon || defaultIcon}
        className={styles.buttonIcon}
      />
    );
    const labelArr = label.split(",").map((l) => l.trim());

    formattedLabel =
      status === StatusOptions.Timein ? labelArr[0] : labelArr[1];

    switch (uiOptions.iconPlacement) {
      case IconPlacementOptions.NoIcon:
        buttonLabel = formattedLabel;
        break;

      case IconPlacementOptions.OnlyIcon:
        buttonLabel = <>{icon}</>;
        break;

      case IconPlacementOptions.IconOnLeft:
        buttonLabel = (
          <>
            {icon} {formattedLabel}
          </>
        );
        break;

      case IconPlacementOptions.IconOnRight:
        buttonLabel = (
          <>
            {formattedLabel} {icon}
          </>
        );
        break;

      default:
        break;
    }

    return buttonLabel;
  };

  return (
    <div className={styles.buttonContainer} style={getContainerStyles()}>
      {timein && <span className={styles.timeinLabel}>{to12HourFormat(timein)}</span>}
      <button
        className={getClasses()}
        style={getStyles()}
        disabled={loading}
        onClick={onButtonClick}
      >
        <span className={styles.flexContainer}>
          <span className={styles.textContainer}>
            <span className={styles.label}>
              {loading ? (
                <Spinner size={SpinnerSize.medium} />
              ) : (
                getButtonLabel()
              )}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
