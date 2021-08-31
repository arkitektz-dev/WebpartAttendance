export function toISOString(date: Date) {
  return date.toISOString();
}

export function to12HourFormat(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
