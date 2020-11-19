export const leftEscape = (str: string): string => {
  return str.replace(/</g, '&lt;');
};

export const escape = (str: string): string => {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quto;');
  str = str.replace(/'/g, '&#39;');
  str = str.replace(/`/g, '&#96;');
  str = str.replace(/\//g, '&#x2F;');
  return str;
};

export const prefixDateTime = (target: number) => {
  return target < 10 ? `0${target}` : target;
};
export type ITime = number | string | Date;
export const formattedDate = (
  time = new Date() as ITime,
  { separator = '/', prefixEnabled = true } = {
    separator: '/',
    prefixEnabled: true,
  }
) => {
  const _time = new Date(time);
  const offset = _time.getTimezoneOffset() * 60 * 1000;
  // 数据库存储的是不带时区的时间戳，故只能手动加上时区
  const __time = new Date(_time.getTime() - offset);
  let month: ITime, date: ITime;
  if (prefixEnabled) {
    month = prefixDateTime(__time.getMonth() + 1);
    date = prefixDateTime(__time.getDate());
  } else {
    month = __time.getMonth() + 1;
    date = __time.getDate();
  }
  return `${__time.getFullYear()}${separator}${month}${separator}${date}`;
};

export const formattedTime = (
  time = new Date() as ITime,
  { separator = ':', prefixEnabled = true } = {
    separator: ':',
    prefixEnabled: true,
  }
) => {
  const _time = new Date(time);
  const offset = _time.getTimezoneOffset() * 60 * 1000;
  const __time = new Date(_time.getTime() - offset);
  let hours: ITime, minutes: ITime, seconds: ITime;
  if (prefixEnabled) {
    hours = prefixDateTime(__time.getHours());
    minutes = prefixDateTime(__time.getMinutes());
    seconds = prefixDateTime(__time.getSeconds());
  } else {
    hours = __time.getHours();
    minutes = __time.getMinutes();
    seconds = __time.getSeconds();
  }
  return `${hours}${separator}${minutes}${separator}${seconds}`;
};
