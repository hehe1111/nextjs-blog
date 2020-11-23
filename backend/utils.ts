import md5 from 'md5';

export const createDigest = (string: string): string => {
  const { SALT_1, SALT_2, SALT_3 } = process.env;
  return md5(md5(md5(string + SALT_1) + SALT_2) + SALT_3);
};
