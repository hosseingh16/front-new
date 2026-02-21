export const isMobile = (str: string): boolean => {
  //const regex = new RegExp('^09[0-9]\\d{8}$');
  return /^(09\d{9}|9\d{9})$/.test(str);
};
