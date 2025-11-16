export const formatDate = (date: Date | string | number): string => {
  return new Intl.DateTimeFormat("de-DE").format(new Date(date));
};
