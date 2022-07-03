export const genProfileId = (num: number) => {
  return num.toString().padStart(6, '0');
};

export const getRandomString = (length = 10) =>
  [...Array(length)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
