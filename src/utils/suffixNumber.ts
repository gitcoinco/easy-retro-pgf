export const suffixNumber = (num: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1_000, symbol: "k" },
    { value: 1_000_000, symbol: "M" },
  ];
  const regexp = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = [...lookup].reverse().find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(2).replace(regexp, "$1") + item.symbol
    : "0";
};
