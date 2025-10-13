export const formatDate = (date) => {
  return new Intl.DateTimeFormat("de-DE").format(new Date(date));
};
