export const formatNumber = (num?: number) =>
  !Number.isNaN(num)
    ? Number(num ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) ?? "0"
    : "0";
