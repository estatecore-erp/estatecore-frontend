// currency formatter — LKR
export const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

// date formatter
export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};
