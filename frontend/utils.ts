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

export type ITime = number | string | Date;
export const formattedDate = (time: ITime): string =>
  new Date(time).toLocaleDateString().replace(/\//g, '-'); // WHY?

export const prefixDateTime = (target: number) => {
  return target < 10 ? `0${target}` : target;
};

export const formattedTime = (
  { time = new Date(), separator = ':', prefixEnabled = true } = {
    time: new Date(),
    separator: ':',
    prefixEnabled: true,
  }
) => {
  const _time = new Date(time);
  let hours: ITime, minutes: ITime, seconds: ITime;
  if (prefixEnabled) {
    hours = prefixDateTime(_time.getHours());
    minutes = prefixDateTime(_time.getMinutes());
    seconds = prefixDateTime(_time.getSeconds());
  } else {
    hours = _time.getHours();
    minutes = _time.getMinutes();
    seconds = _time.getSeconds();
  }
  return `${hours}${separator}${minutes}${separator}${seconds}`;
};
