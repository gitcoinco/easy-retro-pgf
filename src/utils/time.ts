import locale from "date-fns/locale/en-US";
import { format, formatDistanceToNow } from "date-fns";

export const calculateTimeLeft = (
  date: Date,
): [number, number, number, number] => {
  const sec = Math.floor((date.getTime() - Date.now()) / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);
  const days = Math.floor(hrs / 24);

  return [days % 365, hrs % 24, min % 60, sec % 60];
};

export const formatDate = (date: Date | number) =>
  format(date, "dd MMM yyyy HH:mm");
