/* eslint-disable import/prefer-default-export */
const getYYYYMMDDString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthStan = month > 10 ? month : `0${month}`;
  const day = date.getDate();
  const dayStan = day > 10 ? day : `-${day}`;
  return `${year}-${monthStan}-${dayStan}`;
};

export { getYYYYMMDDString };
