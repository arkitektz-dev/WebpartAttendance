import * as moment from "moment";

export function toISOString(date: string) {
  return moment(date).toISOString();
}

export function to12HourFormat(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export function getCurrentWorkingHours(currentUtc: string, startTime: string) {
  const duration = moment.duration(
    moment(new Date(currentUtc), "HH:mm:ss a").diff(
      moment(new Date(startTime), "HH:mm:ss a")
    )
  );

  const hours = duration.hours();
  const minutes = duration.minutes();

  const formattedHours = `${hours < 10 ? "0" : ""}${hours}`;
  const formattedMinutes = `${minutes < 10 ? "0" : ""}${minutes}`;
  const formattedDuration = `${formattedHours}:${formattedMinutes}`;

  return formattedDuration;
}
