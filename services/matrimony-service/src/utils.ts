export const genProfileId = (num: number) => {
  return num.toString().padStart(6, '0');
};
