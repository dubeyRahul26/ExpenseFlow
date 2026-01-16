export const formatMoney = (n: number) =>
  Number(n.toFixed(2)).toLocaleString("en-IN");