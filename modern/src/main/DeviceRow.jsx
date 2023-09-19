import React from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import {
  IconButton,
  Tooltip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import Battery60Icon from "@mui/icons-material/Battery60";
import BatteryCharging60Icon from "@mui/icons-material/BatteryCharging60";
import Battery20Icon from "@mui/icons-material/Battery20";
import BatteryCharging30Icon from "@mui/icons-material/BatteryCharging60";
import Battery30Icon from "@mui/icons-material/Battery20";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";

import SignalCellularConnectedNoInternet0BarIcon from "@mui/icons-material/SignalCellularConnectedNoInternet0Bar";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";
import SignalCellular3BarIcon from "@mui/icons-material/SignalCellular3Bar";
import SignalCellular2BarIcon from "@mui/icons-material/SignalCellular2Bar";
import SignalCellular1BarIcon from "@mui/icons-material/SignalCellular1Bar";

import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

import ErrorIcon from "@mui/icons-material/Error";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { devicesActions } from "../store";
import {
  formatAlarm,
  formatBoolean,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from "../common/util/formatter";
import { useTranslation } from "../common/components/LocalizationProvider";
import { mapIconKey, mapIcons } from "../map/core/preloadImages";
import { useAdministrator } from "../common/util/permissions";
import { ReactComponent as EngineIcon } from "../resources/images/data/engine.svg";
import { useAttributePreference } from "../common/util/preferences";

dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  icon: {
    width: "25px",
    height: "25px",
    filter: "brightness(0) invert(1)",
  },
  batteryText: {
    fontSize: "0.75rem",
    fontWeight: "normal",
    lineHeight: "0.875rem",
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
}));

const DeviceRow = ({ data, index, style }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();

  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);
  const devicePrimary = useAttributePreference("devicePrimary", "name");
  const deviceSecondary = useAttributePreference("deviceSecondary", "");

  const secondaryText = () => {
    let status;
    if (item.status === "online" || !item.lastUpdate) {
      status = formatStatus(item.status, t);
    } else {
      status = dayjs(item.lastUpdate).fromNow();
    }
    return (
      <>
        {deviceSecondary &&
          item[deviceSecondary] &&
          `${item[deviceSecondary]} • `}
        <span className={classes[getStatusColor(item.status)]}>{status}</span>
      </>
    );
  };

  return (
    <div style={style}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
      >
        <ListItemAvatar>
          <Avatar>
            <img
              className={classes.icon}
              src={mapIcons[mapIconKey(item.category)]}
              alt=""
            />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item[devicePrimary]}
          primaryTypographyProps={{ noWrap: true }}
          secondary={secondaryText()}
          secondaryTypographyProps={{ noWrap: true }}
        />
        {position && (
          <>
            {position.attributes?.alarm && (
              <Tooltip
                title={`${t("eventAlarm")}: ${formatAlarm(
                  position.attributes.alarm,
                  t
                )}`}
              >
                <IconButton size="small">
                  <ErrorIcon fontSize="small" className={classes.error} />
                </IconButton>
              </Tooltip>
            )}
            {position.attributes?.ignition && (
              <Tooltip
                title={`${t("positionIgnition")}: ${formatBoolean(
                  position.attributes.ignition,
                  t
                )}`}
              >
                <IconButton size="small">
                  {position.attributes.ignition ? (
                    <EngineIcon
                      width={20}
                      height={20}
                      className={classes.success}
                    />
                  ) : (
                    <EngineIcon
                      width={20}
                      height={20}
                      className={classes.neutral}
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {position?.valid && (
              <Tooltip title={`GPS: ${position?.valid}`}>
                <IconButton size="small">
                  {position?.valid ? (
                    <GpsFixedIcon
                      fontSize="small"
                      className={
                        item?.status === "online"
                          ? classes.success
                          : classes.neutral
                      }
                    />
                  ) : (
                    <GpsNotFixedIcon
                      fontSize="small"
                      className={
                        item?.status === "online"
                          ? classes.error
                          : classes.neutral
                      }
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {position?.network?.cellTowers.length > 0 &&
              position?.network?.cellTowers[0].hasOwnProperty(
                "signalStrength"
              ) && (
                <Tooltip
                  title={`GSM: ${position.network.cellTowers[0].signalStrength}`}
                >
                  <IconButton size="small">
                    {position.network.cellTowers[0].signalStrength > 25 ? (
                      <SignalCellular4BarIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    ) : position.network.cellTowers[0].signalStrength > 20 ? (
                      <SignalCellular3BarIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    ) : position.network.cellTowers[0].signalStrength > 15 ? (
                      <SignalCellular2BarIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.warning
                            : classes.neutral
                        }
                      />
                    ) : position.network.cellTowers[0].signalStrength > 10 ? (
                      <SignalCellular1BarIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.warning
                            : classes.neutral
                        }
                      />
                    ) : (
                      <SignalCellularConnectedNoInternet0BarIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.error
                            : classes.neutral
                        }
                      />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            {position.attributes?.batteryLevel && (
              <Tooltip
                title={`${t("positionBatteryLevel")}: ${formatPercentage(
                  position.attributes.batteryLevel
                )}`}
              >
                <IconButton size="small">
                  {position.attributes.batteryLevel > 70 ? (
                    position.attributes.charge ? (
                      <BatteryChargingFullIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    ) : (
                      <BatteryFullIcon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    )
                  ) : position.attributes.batteryLevel > 30 ? (
                    position.attributes.charge ? (
                      <BatteryCharging60Icon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.warning
                            : classes.neutral
                        }
                      />
                    ) : (
                      <Battery60Icon
                        fontSize="small"
                        className={
                          item.status === "online"
                            ? classes.warning
                            : classes.neutral
                        }
                      />
                    )
                  ) : position.attributes.charge ? (
                    <BatteryCharging20Icon
                      fontSize="small"
                      className={
                        item.status === "online"
                          ? classes.error
                          : classes.neutral
                      }
                    />
                  ) : (
                    <Battery20Icon
                      fontSize="small"
                      className={
                        item.status === "online"
                          ? classes.error
                          : classes.neutral
                      }
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {position?.attributes?.battery && (
              <Tooltip
                title={`${t(
                  "positionBatteryLevel"
                )}: ${position?.attributes?.battery.toFixed(2)}V`}
              >
                <IconButton size="small">
                  {position?.attributes?.battery > 4.1 ? (
                    position?.attributes?.charge ? (
                      <BatteryChargingFullIcon
                        fontSize="small"
                        className={
                          item?.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    ) : (
                      <BatteryFullIcon
                        fontSize="small"
                        className={
                          item?.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    )
                  ) : position?.attributes?.battery > 3.7 ? (
                    position?.attributes?.charge ? (
                      <BatteryCharging60Icon
                        fontSize="small"
                        className={
                          item?.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    ) : (
                      <Battery60Icon
                        fontSize="small"
                        className={
                          item?.status === "online"
                            ? classes.success
                            : classes.neutral
                        }
                      />
                    )
                  ) : position?.attributes?.battery > 3.4 ? (
                    position?.attributes?.charge ? (
                      <BatteryCharging30Icon
                        fontSize="small"
                        className={
                          item?.status === "online"
                            ? classes.warning
                            : classes.neutral
                        }
                      />
                    ) : (
                      <Battery30Icon
                        fontSize="small"
                        className={
                          item?.status === "online"
                            ? classes.warning
                            : classes.neutral
                        }
                      />
                    )
                  ) : position?.attributes?.charge ? (
                    <BatteryCharging20Icon
                      fontSize="small"
                      className={
                        item?.status === "online"
                          ? classes.error
                          : classes.neutral
                      }
                    />
                  ) : (
                    <Battery20Icon fontSize="small" className={classes.error} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
