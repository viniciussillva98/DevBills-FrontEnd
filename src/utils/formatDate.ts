export const formatDate = (date: Date | string): string => {
  const dateObject = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("pt-BR").format(dateObject);
};
