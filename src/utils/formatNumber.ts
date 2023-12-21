export const formatNumber = (num = 0) =>
  Number(num)?.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) ?? "0";
